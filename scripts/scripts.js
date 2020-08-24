'use strict'
//"База данных"
let dataBase = [];

//Титульные кнопки
const addButton = document.querySelector('.addUser'),
    outButton = document.querySelector('.outUser'),
    newButton = document.querySelector('.newUser');

//Предупреждение
const alertWarning = document.querySelector('.alertTitle'),
    alertText = alertWarning.querySelector('.alertText'),
    alertColor = alertWarning.querySelector('.alert');

//Вывод текста
const titleName = document.querySelector('.title-name'),
    titleInfo = document.querySelector('.title-info');

//Таблицы
const adminTable = document.querySelector('.adminTable'),
    adminTableRow = adminTable.querySelector('.tr'),
    userTable = document.querySelector('.userTable'),
    userTableRow = userTable.querySelector('.tr');

//Регистрации
const newUserForm = document.querySelector('.newUserForm'),
    newUserInfo = document.getElementById('newUserInfo'),
    newLogin = document.getElementById('newLogin'),
    newPassword = document.getElementById('newPassword'),
    invalidBlock = document.querySelector('.invalid-feedback'),
    invalidText = document.querySelector('.invalidText'),
    validBlock = document.querySelector('.valid-feedback'),
    validText = document.querySelector('.validText'),
    loginHelp = document.getElementById('loginHelp');

function checkInputLogin () {
    newLogin.addEventListener('input', () => {
        if(dataBase.find(item => item.login === newLogin.value)) {
            loginHelp.style.display = 'none';
            newLogin.classList.remove('is-valid');
            newLogin.classList.add('is-invalid');
            invalidBlock.style.display = 'block';
            validBlock.style.display = 'none';
            invalidText.textContent = "Такой логин уже используется!"
        } else if (newLogin.value === "") {
            newLogin.classList.remove('is-valid');
            newLogin.classList.remove('is-invalid');
            invalidBlock.style.display = 'none';
            validBlock.style.display = 'none';
            loginHelp.style.display = 'block';
        } else {
            loginHelp.style.display = 'none';
            newLogin.classList.remove('is-invalid');
            newLogin.classList.add('is-valid');
            invalidBlock.style.display = 'none';
            validBlock.style.display = 'block';
            validText.textContent = "Звучит неплохо!";
        }
    });
};



function newUser() {
    //Обработка входной строки
    let userInfoArr = editString(newUserInfo);
    //Проверяем на первого пользователя
    let setRole;
    if(dataBase.length === 0) {
        setRole = "admin";
    } else {
        setRole = "user";
    }
    //Сохранение нового объекта
    let user = {
        id: dataBase.length + 1,
        name: userInfoArr[0],
        surname: userInfoArr[1],
        login: newLogin.value,
        password: newPassword.value,
        role: setRole,
        date: setDate(),
        active: false,
    };
    //Запись в сторадж
    dataBase.push(user);
    localStorage.setItem('dataBase', JSON.stringify(dataBase));
    //Закрываем форму и очищаем ее
    document.getElementById('newUser').classList.remove("show");
    newLogin.classList.remove('is-valid');
    newLogin.classList.remove('is-invalid');
    invalidBlock.style.display = 'none';
    validBlock.style.display = 'none';
    loginHelp.style.display = 'display';
    newUserForm.querySelectorAll('.form-control').forEach(function(item) {
        item.value = "";
    });
    //Выводим уведомление
    alertWarning.style.display = 'block';
    alertColor.classList.remove('alert-warning');
    alertColor.classList.add('alert-success');
    alertText.textContent = "Пользователь добавлен!";
    setTimeout(alertHide, 1000);
    //Рендерим страницу
    render();
};

//Авторизация
const addUserForm = document.querySelector('.addUserForm'),
    userLogin = document.getElementById('userLogin'),
    userPassword = document.getElementById('userPassword');

function addUser () {
    //Ищем пользователя по логину
    let user = dataBase.find(item => item.login === userLogin.value);
    if(user) {
        //Сравниваем пароли
        if(user.password === userPassword.value) {
            user.active = true;
            dataBase.splice(dataBase.indexOf(user, 0), 1, user); //Специально не сохраняю сессию текщуго аккаунта
            //Очищаем форму
            document.getElementById('addUser').classList.remove("show");
            document.getElementById('userPassword').value = "";
            document.getElementById('userLogin').value = "";
            //Рендерим страницу
            render(user);
        } else {
            alertWarning.style.display = 'block';
            alertColor.classList.remove('alert-success');
            alertColor.classList.add('alert-warning');
            alertText.textContent = "Неверный пароль!";
            setTimeout(alertHide, 1000);
            document.getElementById('userPassword').value = "";
        }
    } else {
        alertWarning.style.display = 'block';
        alertColor.classList.remove('alert-success');
        alertColor.classList.add('alert-warning');
        alertText.textContent = "Такой пользователь не зарегистрирован";
        setTimeout(alertHide, 1000);
        document.getElementById('userPassword').value = "";
        document.getElementById('userLogin').value = "";
    }
};

//Дополнительные
//Скрытие уведомления
function alertHide () {
    alertWarning.style.display = 'none';
}
//Преобразование строки в массив
function editString (x) {
    let arr = x.value.split(' ');
    for (let i = 0; i < arr.length; i++) {
        while (arr[i] === "") {
            arr.splice(i, 1);
        }
        arr[i] = arr[i].trim();
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
    };
    return arr;
};
//Проверка ввода
function checkLogin (x) {
    x.addEventListener('input', () => {
        x.value = x.value.replace(/[^A-Za-z0-9]/,"");
        return x;
    });
};
function checkUserInfo (x) {
    x.addEventListener('input', () => {
        x.value = x.value.replace(/[^А-Яа-я ]/,"");
        return x;   
    }); 
};
checkUserInfo(newUserInfo);
checkLogin(newLogin);
checkLogin(newPassword);
checkLogin(userLogin);
checkLogin(userPassword);
checkInputLogin();
//Форматирование даты
function setDate () {
    let date = new Date();
    let optionAll = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    function editNullInTime (x) {
        if (x < 10) {
            return  x = '0' + x;
        } else {
            return x;
        }
    }
    let hh = editNullInTime(date.getHours());
    let min = editNullInTime(date.getMinutes());
    let ss = editNullInTime(date.getSeconds());
    let dateAll = date.toLocaleString("ru", optionAll) + ", " +  hh + ':' + min + ':' + ss;
    return dateAll;
};
//Подготовка к рендеру
function showStart () {
    adminTable.style.display = 'none';
    userTable.style.display = 'none';
    alertWarning.style.display = 'none';
}


//Отрисовка страницы
function render(user) {
    document.getElementById('addUser').classList.remove("show");
    document.getElementById('newUser').classList.remove("show");
    if(localStorage.getItem('dataBase')) {
        dataBase = JSON.parse(localStorage.getItem('dataBase'));
    };
    //Удаляем все строки
    document.querySelectorAll('.tr').forEach(function(item) {
        item.remove();
    });
    //Если пользователь авторизован
    if(user) {
        titleName.textContent = user.name;
        titleInfo.textContent = "Ты присоединился к нам: " + user.date;
        newButton.style.display = 'none'
        addButton.style.display = 'none';
        outButton.style.display = 'inline-block';
        outButton.addEventListener('click', () => {
            user.active = false;
            dataBase.splice(dataBase.indexOf(user), 1, user);
            render();
        });
        //Если у пользователя права администратора
        if (user.role === 'admin') {
            //Отображаем таблицу админа
            userTable.style.display = 'none';
            adminTable.style.display = 'table';
            //Рендерим строки
            dataBase.forEach(function(item) {
                const row = adminTableRow.cloneNode(true),
                    editUserButton = row.querySelector('.editUser'),
                    saveUserButton = row.querySelector('.saveUser'),
                    delUserButton = row.querySelector('.delUser');
                //Убираем элементы редактирования
                row.querySelectorAll('.edit').forEach(function(item) {
                    item.style.display = 'none';
                });
                saveUserButton.style.display = 'none';
                //Заполняем строку информацией
                row.querySelector('.staticId').textContent = item.id;
                row.querySelector('.staticName').textContent = item.name;
                row.querySelector('.staticSurname').textContent = item.surname;
                row.querySelector('.staticLogin').textContent = item.login;
                row.querySelector('.staticPassword').textContent = item.password;
                row.querySelector('.staticRole').textContent = item.role;
                row.querySelector('.staticDate').textContent = item.date;
                //Работа с кнопками
                editUserButton.addEventListener('click', () => {
                    //Отображение элементов
                    row.querySelectorAll('.static').forEach(function(item) {
                        item.style.display = 'none';
                    });
                    row.querySelectorAll('.edit').forEach(function(item) {
                        item.style.display = 'block';
                    });
                    editUserButton.style.display = 'none';
                    delUserButton.style.display = 'none';
                    saveUserButton.style.display = 'inline-block';
                    //Заполняем поля
                    const editName = row.querySelector('.editName'),
                        editSurname = row.querySelector('.editSurname'),
                        editLogin = row.querySelector('.editLogin'),
                        editPassword = row.querySelector('.editPassword'),
                        userRole = row.querySelector('.editRole'),
                        role = row.querySelector('.role');
                    editName.value = item.name;
                    editSurname.value = item.surname;
                    editLogin.value = item.login;
                    editPassword.value = item.password;
                    if(item.role === 'admin') {
                        userRole.value = item.role;
                        userRole.textContent = "Администратор";
                        role.value = "user";
                        role.textContent = "Пользователь";
                    } else {
                        userRole.value = item.role;
                        userRole.textContent = "Пользователь";
                        role.value = "admin";
                        role.textContent = "Администратор";
                    }
                    //Валидация полей
                    checkUserInfo(editName);
                    checkUserInfo(editSurname);
                    checkLogin(editLogin);
                    checkLogin(editPassword);
                    checkInputLogin(editLogin);
                    //Сохраняем изменения
                    saveUserButton.addEventListener('click', () => {
                        if(editName.value === '' || editSurname.value === '' || editLogin.value === '' || editPassword.value === '') {
                            alertWarning.style.display = 'block';
                            alertColor.classList.remove('alert-success');
                            alertColor.classList.add('alert-warning');
                            alertText.textContent = "Не должно быть пустых полей!";
                            setTimeout(alertHide, 1000);
                        } if (dataBase.find(item => item.login === editLogin.value)) {
                            alertWarning.style.display = 'block';
                            alertColor.classList.remove('alert-success');
                            alertColor.classList.add('alert-warning');
                            alertText.textContent = "Такой логин уже занят!";
                            setTimeout(alertHide, 1000);
                        }
                        else {
                            let newUser = {
                                id: item.id,
                                name: row.querySelector('.editName').value,
                                surname: row.querySelector('.editSurname').value,
                                login: row.querySelector('.editLogin').value,
                                password: row.querySelector('.editPassword').value,
                                role: row.querySelector('.roleSelector').value,
                                date: item.date,
                                active: item.active, 
                            };
                            dataBase.splice(dataBase.indexOf(item), 1, newUser);
                            localStorage.setItem('dataBase', JSON.stringify(dataBase));
                            console.log(row.querySelector('.roleSelector').value);
                            render(user);
                        }
                    });
                });
                //Если данная строка и есть пользователь - убираем кнопку удалить
                if(user.id === item.id) {
                    delUserButton.style.display = 'none';
                } else {
                    delUserButton.addEventListener('click', () => {
                        dataBase.splice(dataBase.indexOf(item, 0), 1);
                        localStorage.setItem('dataBase', JSON.stringify(dataBase));
                        render(user);
                    });
                };
                //Вставляем строку в таблицу
                adminTable.prepend(row);
            });
        } else {
            adminTable.style.display = 'none';
            userTable.style.display = 'table';
            dataBase.forEach(function(item) {
                const row = userTableRow.cloneNode(true);
                row.querySelector('.staticId').textContent = item.id;
                row.querySelector('.staticName').textContent = item.name;
                row.querySelector('.staticSurname').textContent = item.surname;
                row.querySelector('.staticLogin').textContent = item.login;
                row.querySelector('.staticDate').textContent = item.date;
                userTable.prepend(row);
            });  
        };
    } else {
        newButton.style.display = 'block'
        addButton.style.display = 'block';
        outButton.style.display = 'none';
        titleName.textContent = "незнакомец";
        titleInfo.textContent = "Зарегистрируйся, чтобы получить доступ к выводу твоего имени";
        adminTable.style.display = 'none';
        userTable.style.display = 'table';
        dataBase.forEach(function(item) {
            const row = userTableRow.cloneNode(true);
            row.querySelector('.staticId').textContent = item.id;
            row.querySelector('.staticName').textContent = item.name;
            row.querySelector('.staticSurname').textContent = item.surname;
            row.querySelector('.staticLogin').textContent = item.login;
            row.querySelector('.staticDate').textContent = item.date;
            userTable.prepend(row);
        });
    };
};

//Точка входа
function start() {
    showStart();
    render();
    addUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addUser();
    });
    newUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        newUser();
    });
};

start();
