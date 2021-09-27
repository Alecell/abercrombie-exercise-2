;(function (window, document, helpers) {
  function init() {
    const storeName = 'todo-store';
    const $completedTasks = document.getElementById("completed-tasks");
    const $incompleteTasks = document.getElementById("incomplete-tasks");
    const observer = new MutationObserver(handleMutation);
    let store = JSON.parse(localStorage.getItem(storeName)) || [];

    function getNodeData($el) {
      return {
        id: $el.dataset.id,
        done: $el.querySelector("input[type=checkbox]").checked,
        name: $el.querySelector(".label").innerText,
      }
    }

    function deleteTask(taskToDelete) {
      store = store.filter((task) => task.id !== taskToDelete.id);
    }

    function saveState() {
      window.localStorage.setItem(storeName, JSON.stringify(store));
    }

    function startObservers() {
      observer.observe($incompleteTasks, { childList: true });
      observer.observe($completedTasks, { childList: true });
    }

    function handleMutation(mutations) {
      if (mutations) {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) store.push(getNodeData(mutation.addedNodes[0]));
          if (mutation.removedNodes.length) deleteTask(getNodeData(mutation.removedNodes[0]));
        });
      }
    }
    
    helpers.observer.listen('filled', startObservers);
    helpers.observer.dispatch('store', store);
    window.addEventListener('beforeunload', saveState);
  }

  window.addEventListener('load', init);

})(window, document, helpers);
