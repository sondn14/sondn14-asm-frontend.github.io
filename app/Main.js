var myApp = angular.module("myApp",['ngRoute']);

myApp.config(function ($routeProvider) {
    $routeProvider
        .when("/1", {
            templateUrl: 'TrangChu.html',
            controller: 'subCtrl'
        })
        .when("/2", {
            templateUrl: 'MonHoc.html',
            controller: 'subCtrl'           
        })
        .when("/3/:id/:name", {
            templateUrl: 'testQuizz.html',
            controller: 'quizsCtrl'
        })
        .when("/4", {
            templateUrl: 'Login.html',
            controller: 'subCtrl'
        })
        .when("/5", {
            templateUrl: 'QuanLiUser.html',
            controller: 'subCtrl'
        })
        .when("/6", {
            templateUrl: 'DoiMk.html',
            controller: 'subCtrl'
        })
        .when("/7", {
            templateUrl: 'ThongTinTaiKhoan.html',
            controller: 'subCtrl'
        })
        .when("/8", {
            templateUrl: 'QuenMatKhau.html',
            controller: 'subCtrl'
        })
        .when("/9", {
            templateUrl: 'feedback.html',
        })

        .otherwise({
            redirectTo:"/1" 
        });
});
myApp.controller('quizsCtrl',function($scope,$http,$routeParams,quizzFac){
    $http.get($routeParams.id +'.js' ).then(function(res){
        quizzFac.questions = res.data;
    });

});
myApp.controller('subCtrl',function($scope,$rootScope,$http){
    $scope.listSp = [];
    $http.get('Subjects.js').then(function(res){
        $scope.listSp = res.data;
        $scope.begin = 0;
        $scope.pageCount = Math.ceil($scope.listSp.length / 4);
    });
    $scope.first = function () {
        $scope.begin = 0;
    }
    $scope.prev = function () {
        if ($scope.begin > 0) {
            $scope.begin -= 4;
        }
    }
    $scope.next = function () {
        if ($scope.begin < ($scope.pageCount - 1) * 4) {
            $scope.begin += 4;
        }
    }
    $scope.last = function () {
        $scope.begin = ($scope.pageCount - 1) * 4;
    }

    $scope.isLogin = false;
    $rootScope.listUsers = [];
    $http.get("Students.js")
        .then(function (response) {
            $rootScope.listUsers = response.data;
        });
     
    if(localStorage.getItem('userList')){
        $scope.listUsers = angular.fromJson(localStorage.getItem('userList'))
    }
    $scope.sign = function(){
    for (var i = 0; i < $scope.listUsers.length; i++) {
            if($scope.listUsers[i].email == $scope.user.email){
                alert('Tài khoản đã tồn tại !');
                return false;
            }
        }
       if($scope.user.password == $scope.user.rePassword){
        $scope.listUsers.push($scope.user);
        $scope.user = null;
        localStorage.setItem('userList',angular.toJson($scope.listUsers));
        console.log($scope.listUsers); 
        alert('Đăng ký thành công')
    }else{
        alert('Mật khẩu không khớp');
    }
    }
    if(sessionStorage.getItem('login')){
            $scope.isLogin = true;
            $scope.info = angular.fromJson(sessionStorage.getItem('login'));
            if($scope.info.role){
                $scope.admin = true;
            }else{
                $scope.admin = false
            }
        }  
    $scope.login = function(){
        var user = check_login($scope.email,$scope.password);
        console.log(user);
        if(user){
            sessionStorage.setItem('login',angular.toJson(user));
            alert('Đăng nhập thành công');
            $scope.isLogin = true;
            $scope.info = user;
            $('#staticBackdrop-dn').modal('hide');
            console.log($scope.listUsers);       
        }else{
            $scope.isLogin = false;
            alert('Tài Khoản hoặc mật khẩu sai');
        }
        // console.log($scope.listUsers); 
    };
    function check_login(email,pass){
        for (var i = 0; i < $scope.listUsers.length; i++) {
            if($scope.listUsers[i].email == email && $scope.listUsers[i].password == pass){
                return $scope.listUsers[i];
            }
        }
        return false;
    };
    $scope.logOut = function(){
        sessionStorage.removeItem('login');
        $scope.isLogin = false;
        $scope.info = user;
    }
    $scope.remove_user = function(i){
        $scope.listUsers.splice(i,1);
        localStorage.setItem('userList',angular.toJson($scope.listUsers));
    }
    $scope.update = function(){
        for (var i = 0; i < $scope.listUsers.length; i++) {
            if($scope.listUsers[i].email == $scope.info.email){
                $scope.info.password = angular.copy($scope.user.password);
                $scope.listUsers[i].password = angular.copy($scope.info.password);
                localStorage.setItem('userList',angular.toJson($scope.listUsers));
                alert('Đổi mật khẩu thành công')
            }
        }
        console.log($scope.info);
        console.log($scope.listUsers);
    }
    $scope.update_user = function(){
        for (var i = 0; i < $scope.listUsers.length; i++) {
            if($scope.listUsers[i].email == $scope.info.email){
                $scope.listUsers[i].birthday = angular.copy($scope.info.birthday);
                $scope.listUsers[i].fullname = angular.copy($scope.info.fullname);
                localStorage.setItem('userList',angular.toJson($scope.listUsers));
                alert('Đổi thông tin thành công')
            }
        }
        console.log($scope.info);
        console.log($scope.listUsers);
    }
    $scope.quenmk = function(){
        for (var i = 0; i < $scope.listUsers.length; i++) {
            if($scope.listUsers[i].email == $scope.info.email && $scope.listUsers[i].fullname == $scope.info.fullname && $scope.listUsers[i].birthday == $scope.info.birthday){
                alert('Mật khẩu của bạn là : ' + $scope.listUsers[i].password);
            }else{
                alert('Thông tin sai !');
                return;
            }
        }
        console.log($scope.info);
        console.log($scope.listUsers);
    }
    $scope.hideQuenmk = function(){
        $('#staticBackdrop-dn').modal('hide');
    }
});
myApp.directive('quizz',function(quizzFac,$routeParams){
    return {
        restrict : 'AE', 
        templateUrl:'labQuizz.html',
        link: function($scope,elem,attrs){
            $scope.start = function(){
                quizzFac.getQuestions().then(function(){
                    $scope.subName = $routeParams.name;
                    $scope.page = 1;
                    $scope.id = 0;
                    $scope.quizOver = false; // quiz chưa hoàn thành
                    $scope.inProgess = true;
                    $scope.getQuestion();
                    $scope.startCountdown();        
                });
            }
            $scope.reset = function(){
                $scope.inProgess = false;
                $scope.score = 0;
                $scope.startCountdown();
            }
            $scope.getQuestion = function(){
                var quiz = quizzFac.getQuestion($scope.id);
                if(quiz){
                    $scope.question = quiz.Text;
                    $scope.options = quiz.Answers;
                    $scope.answer = quiz.AnswerId;
                    $scope.answerMode = false;
                }else{
                    $scope.quizOver = true;
                }
            }
            $scope.endgame = function(){
                $scope.inProgess = true;
                $scope.quizOver = true;
            }
            $scope.checkAnswer = function(){
                if(!$('input[name= answers]:checked').length) return;
                var ans = $('input[name = answers]:checked').val();
                if(ans == $scope.answer){
                    $scope.score++;
                    $scope.correctAns = true;
                }else{
                    $scope.correctAns = false;
                }
                $scope.answerMode = true;
            }
            $scope.nextQuestion = function(){
                $scope.id++;
                $scope.getQuestion();
                $scope.page++;   
                // if(page == 10){
                //     $scope.finish = true;
                // }
            }
            $scope.reset();
        }
    }

});
myApp.controller('countDown', function ($scope, $interval) {
    var dem = function () {
        var time = $scope.countdown;
        $scope.countdown -= 1;
        if ($scope.countdown < 1) {
           $scope.endgame();
        }
    };
    var startCountdown = function () {
        $interval(dem, 1000, $scope.countdown)
    };
    $scope.countdown = 600;
    startCountdown();
});
myApp.factory('quizzFac',function($http,$routeParams){
    return{
        getQuestions:function(){
            return $http.get($routeParams.id +'.js' ).then(function(res){
                questions = res.data;
            });
        },
        getQuestion:function(id){
            var randomItem = questions[Math.floor(Math.random() * questions.length)];
            var count = questions.length;
            if(count > 10){
               count = 10;
            }           
            if(id<10){
                return randomItem;
            }
            return false;
        }
    }
});

