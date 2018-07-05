angular.module('web')
    .factory('FaceFotoAuth', ['$q', '$http', '$rootScope', '$location', '$translate', 'AuthInfo', 'Const',
        function ($q, $http, $rootScope, $location, $translate, AuthInfo, Const) {
            var T = $translate.instant;
            return {
                login: login,
                logout: logout
            };

            function login(data) {
                $http({
                    method: 'POST',
                    url: Const.USER_MANAGER_URL + '/api/user/access/login',
                    data: {
                        username: data.user,
                        password: data.pass
                    }
                })
            }

            function logout() {
                var df = $q.defer();
                AuthInfo.remove();
                df.resolve();
                return df.promise;
            }

        }
    ]);
