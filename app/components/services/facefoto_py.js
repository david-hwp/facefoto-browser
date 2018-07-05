angular.module('web')
    .factory('FacefotoPy', ['$q', '$http', '$rootScope', '$location', '$translate', 'AuthInfo', 'Const',
        function ($q, $http, $rootScope, $location, $translate, AuthInfo, Const) {
            var T = $translate.instant;
            return {
                imageFormOssUrl: imageFormOssUrl,
                search: search,
            };

            function imageFormOssUrl(data) {
                var df = $q.defer();
                $http({
                    method: 'POST',
                    url: Const.FACEFOTO_PY_URL + '/images/oss',
                    data: data
                }).then(function successCallback(res) {
                    if (res.data.code === 200) {
                        df.resolve();
                    } else {
                        df.reject(res);
                    }
                }, function errorCallback(res) {
                    // 请求失败执行代码
                    df.reject(res);
                });
                return df.promise
            }

            function search(data) {
                var df = $q.defer();
                $http({
                    method: 'POST',
                    url: Const.FACEFOTO_PY_URL + '/images/searchByOssPath',
                    data: data
                }).then(function successCallback(res) {
                    if (res.data.code === 200) {
                        df.resolve(res.data.data);
                    } else {
                        df.reject(res);
                    }
                }, function errorCallback(res) {
                    // 请求失败执行代码
                    df.reject(res);
                });
                return df.promise;
            }
        }
    ]);
