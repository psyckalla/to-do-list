'use strict'


function watchAddForm() {
    $('.add').submit(event => {
        event.preventDefault();
        const addTask = $('#add-task').val();
        const priorityTask = $('#importance').val();
        addItems(addTask, priorityTask);
        $('input:text').val("");
    });
};

function watchDeleteForm(id) {
    $('form#'+id).submit(event => {
        event.preventDefault();
        const apiURL = `https://api.todoist.com/rest/v1/tasks/${id}`
        $('form#'+id).addClass('hidden');
        const requestOptions = buildAPIHeadersandOptions('DELETE')
        deleteAPI(apiURL, requestOptions)
    });
};

function loadActiveItems() {
    const apiURL = 'https://api.todoist.com/rest/v1/tasks';
    const requestOptions = buildAPIHeadersandOptions('GET')
    fetchAPI(apiURL, requestOptions, displayMultipleItems);

}

function addItems(task, priority) {
    const tasks = JSON.stringify({"content":`${task}`,"project_id":parseInt(priority, 10)});
    const url = 'https://api.todoist.com/rest/v1/tasks'
    const requestOptions = buildAPIHeadersandOptions('POST', tasks)
    fetchAPI(url, requestOptions, displaySingleItems);
    
}

function displaySingleItems(responseJson) {
    $(`section.${responseJson.project_id}`).append(
        `<form class="item-list" id=${responseJson.id}>
        <label class="item-list"><input class="item-list" type=checkbox>${responseJson.content}</label>
        <input class="item-list" type="submit" value="Delete"></form>`)
    $(watchDeleteForm(`${responseJson.id}`));
}

function displayMultipleItems(responseJson) {
    for (let i = 0; i < responseJson.length; i++) {
        $(`section.${responseJson[i].project_id}`).append(
            `<form class="item-list" id=${responseJson[i].id}>
            <label class="item-list"><input class="item-list" type=checkbox>${responseJson[i].content}</label>
            <input class="item-list" type="submit" value="Delete"></form>`)
        $(watchDeleteForm(`${responseJson[i].id}`));
    };
}

function buildAPIHeadersandOptions(method, tasks) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer a8a843df895aadf67a2decc015a6fdf68c60045c");

    const requestOptions = {
        method: method,
        headers: myHeaders,
        body: tasks,
        redirect: 'follow'
    };
    return requestOptions
}

//takes fetch GET and POST requests and also determines how they will be displayed

function fetchAPI(url, requestOptions, howToDisplay) {

    fetch(url, requestOptions)
    .then(response => response.json())
    .then(responseJson => howToDisplay(responseJson))
    .catch(error => console.log('error', error));
}

function deleteAPI(url, requestOptions) {
    fetch(url, requestOptions)
}

function generateAllFunctions() {
    watchAddForm();
    loadActiveItems();
};

$(generateAllFunctions());
