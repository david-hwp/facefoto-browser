angular.module('web')
    .controller('addFolderModalCtrl', ['$scope', '$uibModalInstance', '$translate', 'currentInfo', 'callback', 'Toast', 'Facefoto', 'ossSvs2', 'rank',
        function ($scope, $modalInstance, $translate, currentInfo, callback, Toast, Facefoto, ossSvs2, rank) {
            var T = $translate.instant;
            var now = new Date();
            var twoDaysLater = new Date(new Date().getTime() + 2 * 24 * 3600 * 1000);

            angular.extend($scope, {
                currentInfo: currentInfo,
                rank: rank,
                item: {
                    beginTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()),
                    entTime: new Date(twoDaysLater.getFullYear(), twoDaysLater.getMonth(), twoDaysLater.getDate(), twoDaysLater.getHours(), twoDaysLater.getMinutes())
                },
                cancel: cancel,
                onSubmit: onSubmit,
                reg: {
                    folderName: /^[^\/]+$/
                }
            });

            function cancel() {
                $modalInstance.dismiss('close');
            }

            function onSubmit(form) {
                if (!form.$valid) return;
                var data = angular.copy($scope.item);
                if (data.desc == null || data.desc.length == 0) {
                    Toast.error(T('desc.is.null'));
                    return;
                }
                var folderName = data.name;
                //1、rank==0，调用facefoto服务接口创建社团，成功后创建oss目录
                //2、rank==1，调用facefoto服务接口创建活动，成功后创建python工程的目录，最后创建oss目录
                if (rank == 0) {
                    Facefoto.createCommunity(data).then(function () {
                        ossSvs2.createFolder(currentInfo.region, currentInfo.bucket, currentInfo.key + folderName + '/').then(function () {
                            callback();
                            cancel();
                        });
                        Toast.info(T('community.create.successfully'));
                    }, function (err) {
                        Toast.error(err);
                    })
                } else if (rank == 1) {
                    console.log(data.beginTime);
                    if (currentInfo.data != null) {
                        data.communityId = currentInfo.data._id;
                        data.beginTime = new Date(data.beginTime).getTime();
                        data.entTime = new Date(data.entTime).getTime();
                        if (data.entTime < data.beginTime) {
                            Toast.error(T('begin.time.older.then.end.time'));
                            return;
                        }

                        Facefoto.createActivity(data).then(function () {
                            ossSvs2.createFolder(currentInfo.region, currentInfo.bucket, currentInfo.key + folderName + '/').then(function () {
                                callback();
                                cancel();
                            });
                            Toast.info(T('activity.create.successfully'));
                        }, function (err) {
                            Toast.error(err);
                        })
                    }

                }
            }
        }]);
