( function () {
	'use strict';

	var CHEVRON_PREV = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path d="M15.5 5 8.5 12.5 15.5 20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
	var CHEVRON_NEXT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path d="M9.5 5 16.5 12.5 9.5 20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

	// ── Live mode (PHP generated Swiper HTML) ─────────────────────────────────

	function doInitLiveSlider( el ) {
		el.setAttribute( 'data-ecs-swiper-init', '1' );

		var settings = JSON.parse( el.getAttribute( 'data-ecs-slider-settings' ) || '{}' );

		if ( settings.navigation ) {
			settings.navigation = {
				prevEl: el.querySelector( '.elementor-swiper-button-prev' ),
				nextEl: el.querySelector( '.elementor-swiper-button-next' ),
			};
		}
		if ( settings.pagination ) {
			settings.pagination.el = el.querySelector( '.swiper-pagination' );
		}

		new Swiper( el, settings ); // eslint-disable-line no-undef
	}

	function initLiveSlider( el ) {
		if ( el.hasAttribute( 'data-ecs-swiper-init' ) ) {
			return;
		}

		// Defer init if hidden (e.g. inside display:none responsive-version on desktop).
		// ResizeObserver fires when CSS shows the element — media query triggered by viewport change.
		if ( el.offsetWidth === 0 && typeof ResizeObserver !== 'undefined' ) {
			el.setAttribute( 'data-ecs-swiper-init', 'pending' );
			var ro = new ResizeObserver( function ( entries ) {
				if ( entries[ 0 ].contentRect.width > 0 ) {
					ro.disconnect();
					el.removeAttribute( 'data-ecs-swiper-init' );
					doInitLiveSlider( el );
				}
			} );
			ro.observe( el );
			return;
		}

		doInitLiveSlider( el );
	}

	function initAllLiveSliders() {
		document.querySelectorAll( '.ecs-swiper:not([data-ecs-swiper-init])' ).forEach( initLiveSlider );
	}

	// ── Editor mode (JS builds Swiper from existing DOM) ──────────────────────

	/**
	 * Read slider control values from the parent editor's Backbone model.
	 * This is the same pattern used in ecs-editor-preview.js.
	 */
	function getEditorSettings( containerId ) {
		try {
			return window.parent.elementor.getContainer( containerId ).settings.toJSON();
		} catch ( e ) {
			return {};
		}
	}

	function buildSwiperConfig( s ) {
		var navigation = s.ecs_navigation || 'arrows';
		var showArrows = navigation === 'arrows' || navigation === 'both';
		var showDots   = navigation === 'dots'   || navigation === 'both';

		var colsDesktop = parseInt( s.ecs_slider_columns, 10 ) || 1;
		var colsTablet  = parseInt( s.ecs_slider_columns_tablet, 10 ) || colsDesktop;
		var colsMobile  = parseInt( s.ecs_slider_columns_mobile, 10 ) || colsTablet;
		var layoutTablet = s.ecs_container_type_tablet || '';
		var layoutMobile = s.ecs_container_type_mobile || '';

		var config = {
			slidesPerView: colsDesktop,
			loop:          s.ecs_loop === 'yes',
			speed:         parseInt( s.ecs_speed, 10 ) || 500,
			spaceBetween:  parseInt( s.ecs_space_between, 10 ) || 0,
			breakpoints: {
				0: {
					slidesPerView: colsMobile,
					enabled: layoutMobile !== 'flex' && layoutMobile !== 'grid',
				},
				768: {
					slidesPerView: colsTablet,
					enabled: layoutTablet !== 'flex' && layoutTablet !== 'grid',
				},
				1025: {
					slidesPerView: colsDesktop,
					enabled: true,
				},
			},
		};

		if ( s.ecs_autoplay === 'yes' ) {
			config.autoplay = {
				delay:                parseInt( s.ecs_autoplay_speed, 10 ) || 3000,
				pauseOnMouseEnter:    s.ecs_pause_on_hover === 'yes',
				disableOnInteraction: false,
			};
		}

		return { config: config, showArrows: showArrows, showDots: showDots };
	}

	/**
	 * Move real children back to their scope (e-con-inner or container) then remove swiper.
	 * Using real elements (not clones) keeps Backbone model-binding intact and allows editing.
	 */
	function destroyEditorSlider( containerEl ) {
		var existing = containerEl.querySelector( ':scope > .ecs-editor-swiper' );
		if ( existing ) {
			var inner = containerEl.querySelector( ':scope > .e-con-inner' );
			var scope = inner || containerEl;
			// Move real children back from slides to scope, preserving order
			existing.querySelectorAll( ':scope > .swiper-wrapper > .swiper-slide:not(.swiper-slide-duplicate)' ).forEach( function ( slide ) {
				var child = Array.from( slide.children ).find( function ( el ) {
					return el.dataset && el.dataset.id;
				} );
				if ( child ) {
					scope.appendChild( child );
				}
			} );
			if ( existing.swiper ) {
				existing.swiper.destroy( true, true );
			}
			existing.remove();
		}
		containerEl.classList.remove( 'ecs-editor-slider-active' );
		containerEl.removeAttribute( 'data-ecs-slider-key' );
		containerEl.removeAttribute( 'data-ecs-rebuild-key' );
	}

	/** Cache key based on child IDs only (structural changes). */
	function sliderKey( children ) {
		return children.map( function ( el ) { return el.getAttribute( 'data-id' ); } ).join( ',' );
	}

	/**
	 * Key for settings that require HTML rebuild (navigation type).
	 * Non-structural settings (columns, speed…) are updated in-place by
	 * updateEditorSliderParams() to avoid disturbing the live DOM.
	 */
	function rebuildKey( built ) {
		return ( built.showArrows ? 'a' : '' ) + ( built.showDots ? 'd' : '' );
	}

	/**
	 * Build editor swiper by MOVING real children into slides (not cloning).
	 * Real elements stay connected to their Backbone views so they remain editable.
	 * Loop is disabled in editor to prevent Swiper from creating duplicate [data-id] nodes.
	 */
	function buildEditorSlider( containerEl ) {
		var id       = containerEl.getAttribute( 'data-id' );
		var settings = getEditorSettings( id );

		var inner    = containerEl.querySelector( ':scope > .e-con-inner' );
		var scope    = inner || containerEl;
		var children = Array.from( scope.children ).filter( function ( el ) {
			return el.dataset && el.dataset.id;
		} );

		if ( ! children.length ) {
			return;
		}

		var built      = buildSwiperConfig( settings );
		built.config.loop = false; // disable loop in editor — avoids duplicate [data-id] nodes

		var swiperEl   = document.createElement( 'div' );
		swiperEl.className = 'swiper ecs-swiper ecs-editor-swiper';

		var wrapperEl  = document.createElement( 'div' );
		wrapperEl.className = 'swiper-wrapper';

		// Move real children into slides — preserves Backbone binding and allows editing
		children.forEach( function ( child ) {
			var slide = document.createElement( 'div' );
			slide.className = 'swiper-slide';
			slide.appendChild( child ); // MOVE, not clone
			wrapperEl.appendChild( slide );
		} );
		swiperEl.appendChild( wrapperEl );

		if ( built.showArrows ) {
			swiperEl.insertAdjacentHTML( 'beforeend',
				'<div class="elementor-swiper-button elementor-swiper-button-prev" role="button" tabindex="0">' + CHEVRON_PREV + '</div>' +
				'<div class="elementor-swiper-button elementor-swiper-button-next" role="button" tabindex="0">' + CHEVRON_NEXT + '</div>'
			);
			built.config.navigation = {
				prevEl: swiperEl.querySelector( '.elementor-swiper-button-prev' ),
				nextEl: swiperEl.querySelector( '.elementor-swiper-button-next' ),
			};
		}

		if ( built.showDots ) {
			swiperEl.insertAdjacentHTML( 'beforeend', '<div class="swiper-pagination"></div>' );
			built.config.pagination = {
				el:        swiperEl.querySelector( '.swiper-pagination' ),
				clickable: true,
			};
		}

		// CSS class hides empty .e-con-inner (children were moved out into swiper slides)
		containerEl.classList.add( 'ecs-editor-slider-active' );
		containerEl.appendChild( swiperEl );
		containerEl.setAttribute( 'data-ecs-slider-key', sliderKey( children ) );
		containerEl.setAttribute( 'data-ecs-rebuild-key', rebuildKey( built ) );

		if ( typeof Swiper !== 'undefined' ) { // eslint-disable-line no-undef
			new Swiper( swiperEl, built.config ); // eslint-disable-line no-undef
		}
	}

	function syncEditorSlider( containerEl ) {
		// Backbone re-render may have removed .ecs-editor-swiper while leaving
		// ecs-editor-slider-active class — reset so we fall through to rebuild.
		if (
			containerEl.classList.contains( 'ecs-editor-slider-active' ) &&
			! containerEl.querySelector( ':scope > .ecs-editor-swiper' )
		) {
			destroyEditorSlider( containerEl );
		}

		var swiperEl = containerEl.querySelector( ':scope > .ecs-editor-swiper' );
		var inner    = containerEl.querySelector( ':scope > .e-con-inner' );
		var scope    = inner || containerEl;

		var children;
		if ( swiperEl ) {
			// Slider active: real children live inside swiper slides
			var slideChildren = Array.from(
				swiperEl.querySelectorAll( ':scope > .swiper-wrapper > .swiper-slide:not(.swiper-slide-duplicate)' )
			).map( function ( slide ) {
				return Array.from( slide.children ).find( function ( el ) {
					return el.dataset && el.dataset.id;
				} );
			} ).filter( Boolean );

			// Plus any new direct scope children Backbone may have appended (new widget added)
			var newScopeChildren = Array.from( scope.children ).filter( function ( el ) {
				return el.dataset && el.dataset.id;
			} );
			children = slideChildren.concat( newScopeChildren );
		} else {
			children = Array.from( scope.children ).filter( function ( el ) {
				return el.dataset && el.dataset.id;
			} );
		}

		var cached = containerEl.getAttribute( 'data-ecs-slider-key' );
		if ( cached !== null && cached === sliderKey( children ) ) {
			return; // structure unchanged
		}

		destroyEditorSlider( containerEl ); // moves children back to scope
		if ( children.length ) {
			buildEditorSlider( containerEl );
		}
	}

	/**
	 * Return the resolved ecs_container_type for the current device mode.
	 * Inherits from larger breakpoints when device-specific value is empty.
	 * Mirrors the same logic in ecs-editor-preview.js (parent frame).
	 */
	function getResolvedType( containerEl ) {
		var id = containerEl.getAttribute( 'data-id' );
		if ( ! id ) { return 'flex'; }
		try {
			var device   = window.parent.elementor.channels.deviceMode.request( 'currentMode' ) || 'desktop';
			var settings = window.parent.elementor.getContainer( id ).settings;
			var suffixes = { desktop: '', tablet: '_tablet', mobile: '_mobile' };
			var order    = device === 'mobile'  ? [ 'mobile', 'tablet', 'desktop' ]
			             : device === 'tablet'  ? [ 'tablet', 'desktop' ]
			             : [ 'desktop' ];
			for ( var i = 0; i < order.length; i++ ) {
				var val = settings.get( 'ecs_container_type' + suffixes[ order[ i ] ] );
				if ( val ) { return val; }
			}
			return 'flex';
		} catch ( e ) { return 'flex'; }
	}

	function syncAllEditorSliders() {
		// Cleanup or rebuild stale active markers.
		document.querySelectorAll( '.ecs-editor-slider-active' ).forEach( function ( el ) {
			if ( getResolvedType( el ) !== 'slider' ) {
				destroyEditorSlider( el );
			} else if ( ! el.querySelector( ':scope > .ecs-editor-swiper' ) ) {
				// Elementor re-rendered and removed our swiper DOM — rebuild it.
				destroyEditorSlider( el ); // clears stale ecs-editor-slider-active class
				syncEditorSlider( el );
			}
		} );
		// Build: any container with an ECS slider class that resolves to 'slider' now.
		document.querySelectorAll( '.e-con[class*="-slider"]' ).forEach( function ( el ) {
			if ( ! el.classList.contains( 'ecs-editor-slider-active' ) && getResolvedType( el ) === 'slider' ) {
				syncEditorSlider( el );
			}
		} );
	}

	/**
	 * Update Swiper config in-place without destroy/clone.
	 * Called on settings panel changes (columns, speed, color, etc.).
	 * Falls back to full syncEditorSlider only when HTML structure must change
	 * (navigation type or loop — these require different DOM elements).
	 */
	function updateEditorSliderParams( containerEl ) {
		var swiperEl = containerEl.querySelector( ':scope > .ecs-editor-swiper' );
		if ( ! swiperEl || ! swiperEl.swiper ) {
			syncEditorSlider( containerEl ); // swiper missing — full rebuild
			return;
		}

		var id       = containerEl.getAttribute( 'data-id' );
		var settings = getEditorSettings( id );
		var built    = buildSwiperConfig( settings );
		var swiper   = swiperEl.swiper;

		// Navigation type or loop change requires HTML rebuild (different DOM structure)
		var currRebuildKey = rebuildKey( built );
		var prevRebuildKey = containerEl.getAttribute( 'data-ecs-rebuild-key' );
		if ( prevRebuildKey !== null && prevRebuildKey !== currRebuildKey ) {
			syncEditorSlider( containerEl );
			return;
		}

		// Safe in-place param update — no cloning, no race condition
		swiper.params.slidesPerView = built.config.slidesPerView;
		swiper.params.speed         = built.config.speed;
		swiper.params.spaceBetween  = built.config.spaceBetween;
		swiper.params.breakpoints   = built.config.breakpoints;

		if ( built.config.autoplay ) {
			swiper.params.autoplay = built.config.autoplay;
			if ( swiper.autoplay && ! swiper.autoplay.running ) {
				swiper.autoplay.start();
			}
		} else if ( swiper.autoplay && swiper.autoplay.running ) {
			swiper.autoplay.stop();
			swiper.params.autoplay = false;
		}

		swiper.update();
	}

	function updateAllEditorSliderParams() {
		// Clear the structural key so syncEditorSlider always rebuilds with
		// fresh settings (column count, speed, etc. may have changed).
		document.querySelectorAll( '.ecs-editor-slider-active' ).forEach( function ( el ) {
			el.removeAttribute( 'data-ecs-slider-key' );
			syncEditorSlider( el );
		} );
	}

	// ── Entry point ───────────────────────────────────────────────────────────

	var inEditMode = !! (
		window.elementorFrontend &&
		typeof elementorFrontend.isEditMode === 'function' &&
		elementorFrontend.isEditMode()
	);

	if ( inEditMode ) {
		var suppressObserver = false;

		var observer = new MutationObserver( function ( mutations ) {
			if ( suppressObserver ) { return; }

			var relevant = false;
			for ( var i = 0; i < mutations.length; i++ ) {
				var m = mutations[ i ];
				var t = m.target;
				// Skip mutations caused by our own swiper structure
				if ( t && t.classList && (
					t.classList.contains( 'ecs-editor-swiper' ) ||
					t.classList.contains( 'swiper-wrapper' ) ||
					t.classList.contains( 'swiper-slide' )
				) ) {
					continue;
				}
				relevant = true;
				break;
			}
			if ( relevant ) {
				suppressObserver = true;
				syncAllEditorSliders();
				Promise.resolve().then( function () { suppressObserver = false; } );
			}
		} );

		function setupEditor() {
			syncAllEditorSliders();
			observer.observe( document.body, {
				childList:       true,
				subtree:         true,
				attributes:      true,
				attributeFilter: [ 'class', 'data-id' ],
			} );

			// Safety rebuild at 800ms: catches cases where MutationObserver fires before
			// Backbone has finished populating widget content. syncEditorSlider will
			// also detect empty widgets on each MO-triggered call going forward.
			setTimeout( syncAllEditorSliders, 800 );

			// Settings panel changes (columns, colors, speed…) don't mutate the DOM so
			// MutationObserver never fires. Update Swiper params in-place — no cloning,
			// no race condition with Backbone re-renders.
			try {
				var settingsTimer = null;
				// editor:change fires for panel control edits in real usage.
				window.parent.elementor.channels.editor.on( 'change', function () {
					clearTimeout( settingsTimer );
					settingsTimer = setTimeout( updateAllEditorSliderParams, 150 );
				} );
				// command:after fires for every $e.run() including programmatic changes.
				window.parent.elementor.channels.data.on( 'command:after', function () {
					clearTimeout( settingsTimer );
					settingsTimer = setTimeout( updateAllEditorSliderParams, 150 );
				} );
				// Device mode switch changes which type is active — rebuild sliders.
				window.parent.elementor.channels.deviceMode.on( 'change', function () {
					clearTimeout( settingsTimer );
					settingsTimer = setTimeout( syncAllEditorSliders, 200 );
				} );
			} catch ( e ) { /* cross-origin or elementor unavailable */ }
		}

		// Expose a hook for ecs-editor-preview.js (parent frame) to call when
		// settings change. Cross-frame Backbone channels are unreliable for this.
		window.ecsSliderSettingsChanged = function () {
			// Re-sync existing active sliders with updated params.
			document.querySelectorAll( '.ecs-editor-slider-active' ).forEach( function ( el ) {
				el.removeAttribute( 'data-ecs-slider-key' );
				syncEditorSlider( el );
			} );
			// Build any new sliders that just became active (e.g. type just set to 'slider').
			syncAllEditorSliders();
		};

		// components:init already fired by the time a footer script loads.
		// Run directly — Backbone views are ready by DOMContentLoaded.
		if ( document.readyState === 'loading' ) {
			document.addEventListener( 'DOMContentLoaded', function () {
				setTimeout( setupEditor, 300 );
			} );
		} else {
			setTimeout( setupEditor, 300 );
		}

	} else {
		// Live frontend: PHP already generated Swiper HTML.
		if ( document.readyState === 'loading' ) {
			document.addEventListener( 'DOMContentLoaded', initAllLiveSliders );
		} else {
			initAllLiveSliders();
		}

		if ( typeof MutationObserver !== 'undefined' ) {
			var liveObserver = new MutationObserver( function ( mutations ) {
				var found = false;
				for ( var i = 0; i < mutations.length; i++ ) {
					var added = mutations[ i ].addedNodes;
					for ( var j = 0; j < added.length; j++ ) {
						var node = added[ j ];
						if ( node.nodeType !== 1 ) { continue; }
						if (
							( node.classList && node.classList.contains( 'ecs-swiper' ) ) ||
							( node.querySelector && node.querySelector( '.ecs-swiper:not([data-ecs-swiper-init])' ) )
						) {
							found = true;
							break;
						}
					}
					if ( found ) { break; }
				}
				if ( found ) { initAllLiveSliders(); }
			} );
			liveObserver.observe( document.body, { childList: true, subtree: true } );
		}
	}

} )();
