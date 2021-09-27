;(function (window, document, helpers) {
  function init() {
    const $input = document.getElementById('new-task');
    const $button = document.getElementById('add-task');
    const $completedTasks = document.getElementById('completed-tasks');
    const $incompleteTasks = document.getElementById('incomplete-tasks');

    function isValidName(name) {
      return !!name.trim();
    }

    function taskNameError() {
      alert('All tasks must have a name');
    }

    function getId(id) {
      return id || `${Math.random().toString(16).slice(2)}${new Date().getTime()}`;
    }

    function createTaskElement(taskName, checked, id) {
      const $listItem = document.createElement('li');
      const $wrap = document.createElement('div');
      const $checkBox = document.createElement('input');
      const $label = document.createElement('label');
      const $editInput = document.createElement('input');
      const $editButton = document.createElement('button');
      const $deleteButton = document.createElement('button');
    
      $listItem.className = 'task';
      $listItem.dataset.id = getId(id);
      $wrap.className = 'input-wrap';
      $checkBox.type = 'checkbox';
      $checkBox.className = 'input';
      $checkBox.checked = checked;
      $label.innerText = taskName;
      $label.className = 'label';
      $editInput.type = 'text';
      $editInput.className = 'input';
      $editButton.type = 'button';
      $editButton.innerText = 'Edit';
      $editButton.className = 'edit';
      $deleteButton.innerText = 'Delete';
      $deleteButton.className = 'delete';
      $deleteButton.type = 'button';
    
      $wrap.appendChild($checkBox);
      $wrap.appendChild($label);
      $wrap.appendChild($editInput);
      $wrap.appendChild($editButton);
      $wrap.appendChild($deleteButton);
    
      $listItem.appendChild($wrap);
    
      return $listItem;
    }

    function fillTodos(store) {
      store.forEach((task) => {
        const $item = createTaskElement(task.name, task.done, task.id);

        if (task.done) {
          $completedTasks.appendChild($item);
          bindTaskEvents($item, taskIncomplete);
        }
        
        if (!task.done) {
          $incompleteTasks.appendChild($item);
          bindTaskEvents($item, taskCompleted);
        }
      });

      helpers.observer.dispatch('filled');
    }  

    function bindTaskEvents($item, checkBoxEventHandler) {
      const $checkBox = $item.querySelector('input[type=checkbox]');
      const $editButton = $item.querySelector('button.edit');
      const $deleteButton = $item.querySelector('button.delete');
      $editButton.onclick = editTask;
      $deleteButton.onclick = deleteTask;
      $checkBox.onchange = checkBoxEventHandler;
    }

    function taskCompleted() {
      const $listItem = this.parentNode.parentNode;
      $completedTasks.appendChild($listItem);
      bindTaskEvents($listItem, taskIncomplete);
    }

    function taskIncomplete() {
      const $listItem = this.parentNode.parentNode;
      $incompleteTasks.appendChild($listItem);
      bindTaskEvents($listItem, taskCompleted);
    };

    function deleteTask() {
      const $listItem = this.parentNode.parentNode;
      const $ul = $listItem.parentNode;
      $ul.removeChild($listItem);
    };

    function editTask() {
      const $listItem = this.parentNode.parentNode;
      const $checkbox = $listItem.querySelector('input[type=checkbox]');
      const $editInput = $listItem.querySelector('input[type=text]');
      const $label = $listItem.querySelector('label');
      const $button = $listItem.querySelector('button');
      const editing = $listItem.classList.contains('edit-mode');

      if (editing) {
        if (isValidName($editInput.value)) {
          $label.innerText = $editInput.value;
          $button.innerText = 'Edit';
          $listItem.classList.toggle('edit-mode');
          $checkbox.disabled = false;
        } else {
          taskNameError();
        }
      }
      
      if (!editing) {
        $editInput.value = $label.innerText;
        $button.innerText = 'Save';
        $listItem.classList.toggle('edit-mode');
        $checkbox.disabled = true;
      }
    };

    function addTask() {
      if (isValidName($input.value)) {
        const $newItem = createTaskElement($input.value);
        $incompleteTasks.appendChild($newItem);
        bindTaskEvents($newItem, taskCompleted);
        $input.value = '';
      } else {
        taskNameError();
      }
    }

    helpers.observer.listen('store', fillTodos);

    $button.addEventListener('click', addTask);
    $input.addEventListener('keydown', (e) => e.key === 'Enter' && addTask());
  }

  window.addEventListener('load', init);

})(window, document, helpers);
