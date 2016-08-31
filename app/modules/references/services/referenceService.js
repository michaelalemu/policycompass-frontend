/**
 * Services for connecting to the Reference Pool.
 * Those factories provide adapters for the RESTful API of the Reference Pool.
 * They are built on top of AngularJS' Resource module.
 */

angular.module('pcApp.references.services.reference', [
    'ngResource', 'pcApp.config'
])

/**
 * Factory for getting a Resource, which connects to the unit endpoint
 */
    .factory('Unit', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.REFERENCE_POOL_URL + "/units/:id";
            var Unit = $resource(url, {
                id: "@id"
            }, {
                get: {
                    method: 'GET',
                    cache: true
                },
                query: {
                    method: 'GET',
                    cache: true,
                    isArray: true
                }
            });
            Unit.getById = function (id) {
                return this.get({id: id})
            };
            return Unit;
        }
    ])

/**
 * Factory for getting a Resource, which connects to the unit endpoint
 */
    .factory('UnitCategory', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.REFERENCE_POOL_URL + "/unitcategories/:id";
            var UnitCategory = $resource(url, {
                id: "@id"
            }, {
                get: {
                    method: 'GET',
                    cache: true
                },
                query: {
                    method: 'GET',
                    cache: true,
                    isArray: true
                }
            });
            UnitCategory.getById = function (id) {
                return this.get({id: id})
            };
            return UnitCategory;
        }
    ])

/**
 * Factory for getting a Resource, which connects to the policy domains endpoint
 */
    .factory('PolicyDomain', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.REFERENCE_POOL_URL + "/policydomains/:id";
            var PolicyDomain = $resource(url, {
                id: "@id"
            }, {
                get: {
                    method: 'GET',
                    cache: true
                },
                query: {
                    method: 'GET',
                    cache: true,
                    isArray: true
                }
            });
            PolicyDomain.getById = function (id) {
                return this.get({id: id})
            };
            return PolicyDomain;
        }
    ])

/**
 * Factory for getting a Resource, which connects to the language endpoint
 */
    .factory('Language', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.REFERENCE_POOL_URL + "/languages/:id";
            var Language = $resource(url, {
                id: "@id"
            }, {
                get: {
                    method: 'GET',
                    cache: true
                },
                query: {
                    method: 'GET',
                    cache: true,
                    isArray: true
                }
            });
            return Language;
        }
    ])

/**
 * Factory for getting a Resource, which connects to the external resource endpoint
 */
    .factory('ExternalResource', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.REFERENCE_POOL_URL + "/externalresources/:id";
            var ExternalResource = $resource(url, {
                id: "@id"
            }, {
                get: {
                    method: 'GET',
                    cache: true
                },
                query: {
                    method: 'GET',
                    cache: true,
                    isArray: true
                }
            });
            return ExternalResource;
        }
    ])


/**
 * Factory for getting a Resource, which connects to the date format endpoint
 */
    .factory('DateFormat', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.REFERENCE_POOL_URL + "/dateformats/:id";
            var DateFormat = $resource(url, {
                id: "@id"
            }, {
                get: {
                    method: 'GET',
                    cache: true
                },
                query: {
                    method: 'GET',
                    cache: true,
                    isArray: true
                }
            });
            return DateFormat;
        }
    ])


/**
 * Factory for getting a Class, which connects to the class endpoint
 */
    .factory('Class', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.REFERENCE_POOL_URL + "/classes/:id";
            var Class = $resource(url, {
                id: "@id"
            }, {
                get: {
                    method: 'GET',
                    cache: true
                },
                query: {
                    method: 'GET',
                    cache: true,
                    isArray: true
                }
            });
            Class.getById = function (id) {
                return this.get({id: id})
            };
            return Class;
        }
    ])


/**
 * Factory for getting a Class, which connects to the class endpoint
 */
    .factory('Individual', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.REFERENCE_POOL_URL + "/individuals/:id";
            var Individual = $resource(url, {
                id: "@id"
            }, {
                get: {
                    method: 'GET',
                    cache: true
                },
                query: {
                    method: 'GET',
                    cache: true,
                    isArray: true
                }
            });
            Individual.getById = function (id) {
                return this.get({id: id})
            };
            return Individual;
        }
    ])


/**
 * Factory for getting a Class, which connects to the class endpoint
 */
    .factory('License', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.REFERENCE_POOL_URL + "/licenses/:id";
            var License = $resource(url, {
                id: "@id"
            }, {
                get: {
                    method: 'GET',
                    cache: true
                },
                query: {
                    method: 'GET',
                    cache: true,
                    isArray: true
                }
            });
            License.getById = function (id) {
                return this.get({id: id})
            };
            return License;
        }
    ]);
