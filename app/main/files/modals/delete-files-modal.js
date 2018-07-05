angular.module('web')
    .controller('deleteFilesModalCtrl', ['$scope', '$q', '$uibModalInstance', '$translate', '$timeout', 'items', 'rank', 'currentInfo', 'callback', 'Toast', 'ossSvs2', 'safeApply', 'Facefoto',
        function ($scope, $q, $modalInstance, $translate, $timeout, items, rank, currentInfo, callback, Toast, ossSvs2, safeApply, Facefoto) {
            var T = $translate.instant;

            angular.extend($scope, {
                items: items,
                rank: rank,
                currentInfo: currentInfo,
                step: 1,
                start: start,
                stop: stop,
                close: close
            });

            function stop() {
                //$modalInstance.dismiss('cancel');
                $scope.isStop = true;
                ossSvs2.stopDeleteFiles();
            }

            function close() {
                $modalInstance.dismiss('cancel');
            }

            function start() {
                $scope.isStop = false;
                $scope.step = 2;
                //TODO 回调删除接口
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (rank == 0) {
                        Facefoto.deleteCommunity(item._id).then(function () {
                            Toast.info(T('community.delete.successfully'));
                        }, function (err) {
                            stop();
                            close();
                            Toast.error(err);
                        })
                    } else if (rank == 1) {
                        Facefoto.deleteActivity(item._id).then(function () {
                            Toast.info(T('activity.delete.successfully'));
                        }, function (err) {
                            stop();
                            close();
                            Toast.error(err);
                        })
                    }
                }
                ossSvs2.deleteFiles(currentInfo.region, currentInfo.bucket, items, function (prog) {
                    //进度
                    $scope.progress = angular.copy(prog);
                    safeApply($scope);
                }).then(function (terr) {
                    //结果
                    $scope.step = 3;
                    $scope.terr = terr;
                    callback();
                });
            }
        }]);
