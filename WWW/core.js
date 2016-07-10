var todoApp = angular.module('scotchTodo', []);

//function mainController($scope, $http) {
todoApp.controller('mainController', ['$scope','$http', function($scope,$http) {
	$scope.formData = {};
	$scope.isLoading = false;
	
	// Get a list of lists
	$scope.getListOfLists = function(){
		$http.get('/api/lists')
			.success(function(data) {
				$scope.lists = data;
				$scope.setCurrentList($scope.lists[0]);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	}
	
	// Get a list to populate view
	$scope.getTodos = function(listId){
		$http.get('/api/todos')
			.success(function(data) {
				$scope.todos = data;
				$scope.progress = $scope.getProgress();
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	}
	
	$scope.isActiveList = function(list){
		if(!list._id) return false;
		return list._id===$scope.currentList;
	}
	
	$scope.setCurrentList = function(list){
		if(list){
			$scope.currentListName = list.name || null;
			$scope.currentList = list._id || null;
			$scope.progress = $scope.getProgress();
			console.log($scope.progress );
		}
		else{
			$scope.currentListName = '';
			$scope.currentList = null;
			$scope.progress = $scope.getProgress();
			console.log($scope.progress );
		}
	}
	
	// delete a todo after checking it
	$scope.deleteList = function(listId) {
		if(!$scope.isLoading){
			$scope.isLoading = true;
			// Todo is checked, so delete it
			$http.delete('/api/lists/' + listId)
				.success(function(data) {
					$scope.lists = data;
					if($scope.lists[0]){$scope.setCurrentList($scope.lists[0]);
					}else $scope.setCurrentList(null);
					$scope.isLoading = false;
				})
				.error(function(data) {
					console.log('Error: ' + data);
					$scope.isLoading = false;
				});
			$scope.progress = $scope.getProgress();
		}
	};
	
	// when submitting the add form, send the text to the node API-
	$scope.createList = function() {		
		if(!$scope.isLoading && $scope.listForm.name && $scope.listForm.name != ""){
			$scope.isLoading = true;
			$http.post('/api/lists', {name: $scope.listForm.name})
				.success(function(data) {
					$scope.lists = data;
					$scope.setCurrentList($scope.lists[0]);
					$scope.isLoading = false;
					$scope.listForm.name = '';
					$scope.progress = $scope.getProgress();
				})
				.error(function(data) {
					console.log('Error: ' + data);
					$scope.isLoading = false;
					$scope.listForm.name = '';
				});
		}
	};

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		if(!$scope.isLoading && $scope.formData.text && $scope.formData.text != "" && $scope.currentList){
			$scope.isLoading = true;
			$scope.formData.list = $scope.currentList;
			$http.post('/api/todos', $scope.formData)
				.success(function(data) {
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.todos = data;
					$scope.isLoading = false;
					$scope.progress = $scope.getProgress();
				})
				.error(function(data) {
					console.log('Error: ' + data);
					$scope.isLoading = false;
				});
		}
	};

	// delete a todo after checking it
	$scope.deleteTodo = function(todo,id) {
		if(!$scope.isLoading){
			if(!todo.text)todo.text = " "; // Just in case a textless entry slipped thru
			$scope.isLoading = true;
			// Todo is checked, so delete it
			if(todo.done){
				$http.delete('/api/todos/' + id)
					.success(function(data) {
						$scope.todos = data;
						$scope.isLoading = false;
						$scope.progress = $scope.getProgress();
					})
					.error(function(data) {
						console.log('Error: ' + data);
						$scope.isLoading = false;
					});
			}
			// Todo is un-checked, so check it
			else {
				todo.done = true;
				$http.put('/api/todos/' + id, todo)
					.success(function(data) {
						$scope.todos = data;
						$scope.isLoading = false;
						$scope.progress = $scope.getProgress();
					})
					.error(function(data) {
						console.log('Error: ' + data);
						$scope.isLoading = false;
					});
			}
		}
	};
	
	$scope.uncheck = function(todo,id)	{
		if(!$scope.isLoading){
			$scope.isLoading = true;
			todo.done=false;
			// Todo is un-checked, so check it
			$http.put('/api/todos/' + id, todo)
				.success(function(data) {
					$scope.todos = data;
					$scope.isLoading = false;
					$scope.progress = $scope.getProgress();
				})
				.error(function(data) {
					console.log('Error: ' + data);
					$scope.isLoading = false;
				});
		}
	};
	
	$scope.getProgress = function(){
		if(!$scope.todos || $scope.todos.length === 0 ) return 0;
		var doneCount = 0;
		var listCount = 0;
		for(i = 0; i < $scope.todos.length; i++){
			if($scope.todos[i].list === $scope.currentList)
			{
				listCount++;
				if($scope.todos[i].done)doneCount++;
			}
		};
		return  Math.floor((doneCount /listCount) * 100);
	};
	
	// Populate on init
	$scope.getListOfLists();
	$scope.getTodos();
}]);
