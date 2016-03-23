(function () {
    angular
        .module('app', ['ngRoute'])
        .config(appConfig)
        .controller('PageController', PageController);

    function PageController($location, $route, $routeParams) {
        this.route = $route;
        this.location = $location.$$absUrl;
        this.routeParams = $routeParams;
    }

    function appConfig($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                controller: 'PageController',
                controllerAs: 'page',
                templateUrl: 'tpl/page.tpl.html'
            })
            .when('/:page/:subpage?', {
                controller: 'PageController',
                controllerAs: 'page',
                templateUrl: 'tpl/page.tpl.html'
            })
            .when('/:page/:path*', {
                controller: 'PageController',
                controllerAs: 'page',
                templateUrl: 'tpl/page.tpl.html'
            })
            .otherwise('/');
    }
})();