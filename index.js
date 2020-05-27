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
    $('#'+id).submit(event => {
        event.preventDefault();
        $(event.target).addClass('hidden');
        //const itemToDelete = event.target.id;
        //deleteFromList(itemToDelete);
    });
};

function addItems(task, priority) {
    const raw = JSON.stringify({"content":`${task}`,"project_id":parseInt(priority, 10)});
    const url = 'https://api.todoist.com/rest/v1/tasks'
    fetchAPI('Post', url, raw, displaySingleItems);
}

function displaySingleItems(responseJson) {
    $(`article.${responseJson.project_id}`).append(
        `<form class="item-list" id=${responseJson.id}>
        <label>${responseJson.content}<input type=checkbox></label>
        <input type="submit" value="Delete"></form>`)
    $(watchDeleteForm(`${responseJson.project_id}`));
}

function fetchAPI(method, url, raw, howToDisplay) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer a8a843df895aadf67a2decc015a6fdf68c60045c");

    let library = {};
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const responseJson = fetch(url, requestOptions)
    .then(response => response.json())
    .then(responseJson => howToDisplay(responseJson))
    .catch(error => console.log('error', error));
}




function generateAllFunctions() {
    watchAddForm();
};

$(generateAllFunctions());
