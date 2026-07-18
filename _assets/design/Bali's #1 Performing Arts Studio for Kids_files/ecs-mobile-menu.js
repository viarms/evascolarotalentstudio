( function () {
	'use strict';

	var LAYOUT_CLASSES = [
		'elementor-nav-menu--layout-horizontal',
		'elementor-nav-menu--layout-vertical',
		'elementor-nav-menu--layout-dropdown',
	];

	function getBreakpoints() {
		var cfg = window.elementorFrontendConfig;
		var bp  = cfg && cfg.responsive && cfg.responsive.breakpoints || {};
		return {
			mobile : ( bp.mobile && bp.mobile.value ) || 767,
			tablet : ( bp.tablet && bp.tablet.value ) || 1024,
		};
	}

	function getActiveLayout( el, bp ) {
		var w = window.innerWidth;

		// Native Elementor Breakpoint: dropdown-mobile / dropdown-tablet class
		// takes priority over ECS responsive layout variables.
		if ( w <= bp.mobile && el.classList.contains( 'elementor-nav-menu--dropdown-mobile' ) ) {
			return 'dropdown';
		}
		if ( w <= bp.tablet && el.classList.contains( 'elementor-nav-menu--dropdown-tablet' ) ) {
			return 'dropdown';
		}

		// ECS responsive layout — read the CSS custom property that our responsive
		// selectors set at the correct @media breakpoint.
		var style      = window.getComputedStyle( el );
		var mainDisplay = style.getPropertyValue( '--ecs-nav-main-display' ).trim();
		var mainDir     = style.getPropertyValue( '--ecs-nav-main-dir' ).trim();

		if ( mainDisplay === 'none' ) { return 'dropdown'; }
		if ( mainDir     === 'column' ) { return 'vertical'; }
		return 'horizontal';
	}

	function syncAll() {
		var bp  = getBreakpoints();
		var els = document.querySelectorAll(
			'.ecs-nav-layout-horizontal,.ecs-nav-layout-vertical,.ecs-nav-layout-dropdown'
		);
		els.forEach( function ( el ) {
			var layout = getActiveLayout( el, bp );
			LAYOUT_CLASSES.forEach( function ( c ) { el.classList.remove( c ); } );
			el.classList.add( 'elementor-nav-menu--layout-' + layout );
		} );
	}

	// Register before Elementor Pro scripts (which load in the footer).
	// This script is enqueued in the <head> so our DOMContentLoaded listener
	// fires before theirs, ensuring the correct layout class is set when
	// SmartMenus and the nav-menu widget initialise.
	document.addEventListener( 'DOMContentLoaded', syncAll );
	window.addEventListener( 'resize', syncAll );
} )();
