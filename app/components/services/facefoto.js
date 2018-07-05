angular.module('web')
    .factory('Facefoto', ['$q', '$http', '$rootScope', '$location', '$translate', 'AuthInfo', 'Const',
        function ($q, $http, $rootScope, $location, $translate, AuthInfo, Const) {
            var T = $translate.instant;

            return {
                register: register,
                login: login,
                getCommunity: getCommunity,
                deleteCommunity: deleteCommunity,
                createCommunity: createCommunity,
                getActivity: getActivity,
                deleteActivity: deleteActivity,
                createActivity: createActivity,
                logout: logout
            };

            function register(data) {
                var df = $q.defer();
                $http({
                    method: 'POST',
                    url: Const.USER_MANAGER_URL + '/user',
                    data: {
                        username: data.user,
                        password: data.pass,
                        realName: data.realName
                    }
                }).then(function successCallback(res) {
                    if (res.data.code === 0) {
                        df.resolve();
                    } else {
                        df.reject(res.data.msg);
                    }
                }, function errorCallback(res) {
                    // 请求失败执行代码
                    df.reject(res);
                });
                return df.promise
            }

            function login(data) {
                var df = $q.defer();
                $http({
                    method: 'POST',
                    url: Const.USER_MANAGER_URL + '/user/access/login',
                    data: {
                        username: data.user,
                        password: data.pass
                    }
                }).then(function successCallback(res) {
                    if (res.data.code === 0) {
                        data.token = res.data.data.token;
                        var oss = {
                            eptpl: Const.OSS_ENDPOINT,
                            id: Const.OSS_ACCESS_KEY_ID,
                            secret: Const.OSS_ACCESS_KEY_SECRET,
                            osspath: Const.OSS_DEFAULT_PATH
                        };
                        $.extend(data, oss);
                        df.resolve(data);
                    } else {
                        df.reject(res.data.msg);
                    }
                }, function errorCallback(res) {
                    // 请求失败执行代码
                    df.reject(res);
                });
                return df.promise;
            }

            function getCommunity(data) {
                var df = $q.defer();
                // data.httpOptions = {timeout: 15000};
                $http({
                    method: 'GET',
                    url: Const.USER_MANAGER_URL + '/user/access/community?page=' + data.page + '&pageSize=' + data.pageSize,
                    headers: {
                        'Authorization': 'Bearer ' + AuthInfo.get().token,
                    }
                }).then(function successCallback(res) {
                    if (res.data.code === 0) {
                        df.resolve(res.data.data);
                    } else {
                        df.reject(res.data.msg);
                    }
                }, function errorCallback(res) {
                    // 请求失败执行代码
                    df.reject(res);
                });
                return df.promise;
            }

            function createCommunity(data) {
                var df = $q.defer();
                // data.httpOptions = {timeout: 15000};
                $http({
                    method: 'POST',
                    url: Const.USER_MANAGER_URL + '/community',
                    headers: {
                        'Authorization': 'Bearer ' + AuthInfo.get().token,
                    },
                    data: data
                }).then(function successCallback(res) {
                    if (res.data.code === 0) {
                        df.resolve(res.data.data);
                    } else {
                        df.reject(res.data.msg);
                    }
                }, function errorCallback(res) {
                    // 请求失败执行代码
                    df.reject(res);
                });
                return df.promise;
            }

            function deleteCommunity(communityId) {
                var df = $q.defer();
                // data.httpOptions = {timeout: 15000};
                $http({
                    method: 'DELETE',
                    url: Const.USER_MANAGER_URL + '/community/' + communityId,
                    headers: {
                        'Authorization': 'Bearer ' + AuthInfo.get().token,
                    }
                }).then(function successCallback(res) {
                    if (res.data.code === 0) {
                        df.resolve(res.data.data);
                    } else {
                        df.reject(res.data.msg);
                    }
                }, function errorCallback(res) {
                    // 请求失败执行代码
                    df.reject(res);
                });
                return df.promise;
            }

            function getActivity(data) {
                var df = $q.defer();
                // data.httpOptions = {timeout: 15000};
                $http({
                    method: 'GET',
                    url: Const.USER_MANAGER_URL + '/activity?communityId=' + data.communityId + '&keword=&page=' + data.page + '&pageSize=' + data.pageSize,
                    headers: {
                        'Authorization': 'Bearer ' + AuthInfo.get().token,
                    },
                }).then(function successCallback(res) {
                    if (res.data.code === 0) {
                        df.resolve(res.data.data);
                    } else {
                        df.reject(res.data.msg);
                    }
                }, function errorCallback(res) {
                    // 请求失败执行代码
                    df.reject(res);
                });
                return df.promise;
            }

            function createActivity(data) {
                var df = $q.defer();
                // data.httpOptions = {timeout: 15000};
                console.log(data);
                $http({
                    method: 'POST',
                    url: Const.USER_MANAGER_URL + '/activity',
                    headers: {
                        'Authorization': 'Bearer ' + AuthInfo.get().token,
                    },
                    data: data
                }).then(function successCallback(res) {
                    if (res.data.code === 0) {
                        df.resolve(res.data.data);
                    } else {
                        df.reject(res.data.msg);
                    }
                }, function errorCallback(res) {
                    // 请求失败执行代码
                    df.reject(res);
                });
                return df.promise;
            }

            function deleteActivity(activityId) {
                var df = $q.defer();
                // data.httpOptions = {timeout: 15000};
                $http({
                    method: 'DELETE',
                    url: Const.USER_MANAGER_URL + '/activity/' + activityId,
                    headers: {
                        'Authorization': 'Bearer ' + AuthInfo.get().token,
                    }
                }).then(function successCallback(res) {
                    if (res.data.code === 0) {
                        df.resolve(res.data.data);
                    } else {
                        df.reject(res.data.msg);
                    }
                }, function errorCallback(res) {
                    // 请求失败执行代码
                    df.reject(res);
                });
                return df.promise
            }

            function logout() {
                var df = $q.defer();
                AuthInfo.remove();
                df.resolve();
                return df.promise;
            }

        }
    ]);
