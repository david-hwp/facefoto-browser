angular.module('web')
    .controller('loginCtrl', ['$scope', '$http', '$rootScope', '$translate', 'Auth', 'AuthInfo', '$timeout', '$location', 'Const', 'Dialog', 'Toast', 'Cipher', 'Facefoto',
        function ($scope, $http, $rootScope, $translate, Auth, AuthInfo, $timeout, $location, Const, Dialog, Toast, Cipher, Facefoto) {

            var DEF_EP_TPL = 'https://{region}.aliyuncs.com';

            var KEY_REMEMBER = Const.KEY_REMEMBER;
            var SHOW_HIS = Const.SHOW_HIS;
            var KEY_AUTHTOKEN = 'key-authtoken';
            var regions = angular.copy(Const.regions);

            var T = $translate.instant;

            angular.extend($scope, {
                gtab: parseInt(localStorage.getItem('gtag') || 1),
                flags: {
                    remember: 'NO',
                    showHis: 'NO'
                },
                item: {
                    eptpl: DEF_EP_TPL,
                },
                eptplType: 'default',

                hideTopNav: 1,
                reg_osspath: /^oss\:\/\//,
                regions: regions,
                login: login,
                showCleanHistories: showCleanHistories,
                useHis: useHis,
                showRemoveHis: showRemoveHis,

                open: open,

                register: register,
                authTokenChange: authTokenChange,

                eptplChange: eptplChange
            });

            $scope.$watch('item.eptpl', function (v) {
                $scope.eptplType = (v == DEF_EP_TPL) ? 'default' : 'customize';
            });
            $scope.$watch('gtab', function (v) {
                localStorage.setItem('gtag', v)
            });


            function eptplChange(t) {
                $scope.eptplType = t;
                //console.log(t);
                if (t == 'default') {
                    $scope.item.eptpl = DEF_EP_TPL;
                } else {
                    $scope.item.eptpl = '';
                }
            }

            function open(a) {
                openExternal(a);
            }

            var tid;

            function authTokenChange() {
                $timeout.cancel(tid);
                tid = $timeout(function () {
                    var authToken = $scope.item.authToken || '';

                    localStorage.setItem(KEY_AUTHTOKEN, authToken);

                    if (!authToken) {
                        $scope.authTokenInfo = null;
                        return;
                    }

                    try {
                        var str = Buffer.from(authToken, 'base64').toString();
                        var info = JSON.parse(str);

                        if (info.id && info.secret && info.stoken && info.privilege && info.expiration && info.osspath) {

                            //过期
                            try {
                                var d = new Date(info.expiration).getTime();
                                info.isExpired = d <= new Date().getTime();
                            } catch (e) {

                            }
                            $scope.authTokenInfo = info;

                            $scope.authTokenInfo.expirationStr = moment(new Date(info.expiration)).format('YYYY-MM-DD HH:mm:ss');

                        }
                        else if (info.id && info.secret && !info.id.startsWith('STS.')) {
                            //子用户ak
                            $scope.authTokenInfo = info;
                        }
                        else if (new Date(info.expiration).getTime() < new Date().getTime()) {
                            $scope.authTokenInfo = null;
                        }
                    } catch (e) {
                        $scope.authTokenInfo = null;
                    }
                }, 600);
            }

            init();

            function init() {
                $scope.flags.remember = localStorage.getItem(KEY_REMEMBER) || 'NO';
                $scope.flags.showHis = localStorage.getItem(SHOW_HIS) || 'NO';
                angular.extend($scope.item, AuthInfo.getRemember());


                //临时token
                $scope.item.authToken = localStorage.getItem(KEY_AUTHTOKEN) || '';
                authTokenChange();

                listHistories();

                $scope.$watch('flags.remember', function (v) {
                    if (v == 'NO') {
                        AuthInfo.unremember();
                        localStorage.setItem(KEY_REMEMBER, 'NO');
                    }
                });

                $scope.$watch('flags.showHis', function (v) {
                    localStorage.setItem(SHOW_HIS, v);
                });
            }

            function useHis(h) {
                angular.extend($scope.item, h);
                // $scope.item.id=h.id;
                // $scope.item.secret = h.secret;
                // $scope.item.desc = h.desc;
            }

            function showRemoveHis(h) {
                var title = T('auth.removeAK.title'); //删除AK
                var message = T('auth.removeAK.message', {user: h.user}); //'ID：'+h.id+', 确定删除?'
                Dialog.confirm(title, message, function (b) {
                    if (b) {
                        AuthInfo.removeFromHistories(h.id);
                        listHistories();
                    }
                }, 1);
            }

            function listHistories() {
                $scope.his = AuthInfo.listHistories();
            }

            function showCleanHistories() {
                var title = T('auth.clearAKHistories.title'); //清空AK历史
                var message = T('auth.clearAKHistories.message'); //确定?
                var successMessage = T('auth.clearAKHistories.successMessage'); //已清空AK历史
                Dialog.confirm(title, message, function (b) {
                    if (b) {
                        AuthInfo.cleanHistories();
                        listHistories();
                        Toast.success(successMessage);
                    }
                }, 1);
            }


            function login(form1) {

                if (!form1.$valid) return;

                localStorage.setItem(KEY_REMEMBER, $scope.flags.remember);

                var data = angular.copy($scope.item);
                //trim password
                if (data.pass) data.pass = data.pass.trim();

                // delete data.authToken;
                // delete data.securityToken;
                //
                // if (data.id.indexOf('STS.') != 0) {
                //     delete data.stoken;
                // }

                if ($scope.flags.remember == 'YES') {
                    AuthInfo.remember(data);
                }

                Toast.info(T('logining'), 1000);
                Facefoto.login(data).then(function (data) {
                    Auth.login(data).then(function () {
                        if ($scope.flags.remember == 'YES') AuthInfo.addToHistories(data);
                        Toast.success(T('login.successfully'), 1000);
                        $location.url('/');
                        console.log(AuthInfo.get())
                    }, function (err) {
                        Toast.error(err.code + ':' + err.message);
                    });
                }, function (err) {
                    Toast.error(err);
                });
                return false;
            }

            //register
            function register(form2) {
                if (!form2.$valid) return;
                var data = angular.copy($scope.item);
                if (data.pass !== data.confirm_pass) {
                    Toast.error(T('register.password.notequal'), 1000);
                    return;
                }
                Facefoto.register(data).then(function () {
                    Toast.success(T('register.successfully'), 1000);
                    localStorage.setItem('gtag', 1);
                    $scope.gtab = 1;
                    $location.url('/login');
                }, function (err) {
                    Toast.error(err);
                });
            }

        }]);