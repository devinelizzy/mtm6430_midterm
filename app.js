angular.module('ToDo',[])

.directive("formatDate", function(){ // functions formats date so input does not create error
  return {
   require: 'ngModel',
    link: function(scope, elem, attr, modelCtrl) {
      modelCtrl.$formatters.push(function(modelValue){
        return new Date(modelValue);
      })
    }
  }
})
.constant('metaData', {
  'title':"words",
  'date':"words",
  'edit':false,
  'done':false})

.run( ($rootScope, metaData) => {
    // We'll inject our constant 'metaData' into the rootScope so that is accessible
    // in our index.html
    $rootScope.metaData = metaData

    // We will test the support for localStorage once at startup and then cache the
    // result for later use by our service component.
    try {
        localStorage.setItem("testKey", "this is the value to be saved")
        localStorage.removeItem("testKey")
        $rootScope.haslocalStorageSupport = true
    }
    catch(error){
        $rootScope.haslocalStorageSupport = false
    }

  } )


.controller('TodoController',['$scope','$rootScope',function($scope, $rootScope){

if ($rootScope.haslocalStorageSupport) {
    var todos = JSON.parse(localStorage.getItem('todos')) // assign to temp varaible what we get back from local storage
    $scope.todos = Array.isArray(todos) ? todos : [ ]; // tests did we get an array, if did assign to scope var
}
else {
  $scope.todos = [ ]; // if not, placeholder.
}

$scope.syncToStorage = function(){
  localStorage.setItem('todos', JSON.stringify($scope.todos));
    console.log()
}

//$scope.todos=[];

$scope.editClick = function(){
    $scope.todos.push({'edit':false});
    localStorage.setItem('todos', JSON.stringify($scope.todos));
}


// add item - gets data input from scope.todos and pushes it in the array.
$scope.addItem=function(){
$scope.todos.push({
  'title':$scope.newItem.item,
  'date':$scope.newItem.date,
  'edit':false, // default false value
  'done':false}),
//clears the window after set
$scope.newItem.item = ""
$scope.newItem.date = ""
$scope.syncToStorage()
}
// filters todo items and remove done
$scope.clearCompleted=function(){
$scope.todos = $scope.todos.filter(function(item){
  return !item.done
})
$scope.syncToStorage()
}

}]) // end of controller
