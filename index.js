'use strict'

const CORS = 'https://cors-anywhere.herokuapp.com/';

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
        fetchAPI('DELETE', apiURL, hideItem);
    });
};

function loadActiveItems() {
    const apiURL = 'https://api.todoist.com/rest/v1/tasks';
    fetchAPI('GET', apiURL, displayMultipleItems);

}

function addItems(task, priority) {
    const raw = JSON.stringify({"content":`${task}`,"project_id":parseInt(priority, 10)});
    const url = 'https://api.todoist.com/rest/v1/tasks'
    fetchAPI('POST', url, displaySingleItems, raw);
}

function displaySingleItems(responseJson) {
    console.log(responseJson[0]);
    $(`article.${responseJson.project_id}`).append(
        `<form class="item-list" id=${responseJson.id}>
        <label><input type=checkbox>${responseJson.content}</label>
        <input type="submit" value="Delete"></form>`)
    $(watchDeleteForm(`${responseJson.id}`));
}

function displayMultipleItems(responseJson) {
    console.log(responseJson);
    for (let i = 0; i < responseJson.length; i++) {
        $(`article.${responseJson[i].project_id}`).append(
            `<form class="item-list" id=${responseJson[i].id}>
            <label class="item-list"><input type=checkbox>${responseJson[i].content}</label>
            <input type="submit" value="Delete"></form>`)
        $(watchDeleteForm(`${responseJson[i].id}`));
    };

}

function hideItem() {

}

function fetchAPI(method, url, howToDisplay, raw) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer a8a843df895aadf67a2decc015a6fdf68c60045c");

    let library = {};
    const requestOptions = {
        method: method,
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const responseJson = fetch(url, requestOptions)
    .then(response => { if (response.status === 200) {
        return response.json()
    } else if (response.status === 204) {
        howToDisplay(response);
    }} )
    .then(responseJson => howToDisplay(responseJson))
    .catch(error => console.log('error', error));
}

function generateAllFunctions() {
    watchAddForm();
    loadActiveItems();
};

$(generateAllFunctions());
