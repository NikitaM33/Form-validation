let inputs = document.querySelectorAll('input[data-rule]');
let noField = document.querySelector('.form__noFieldError');
let nameError = document.querySelector('.form__inputName__error');
let emailError = document.querySelector('.form__inputEmail__error');
let phoneError = document.querySelector('.form__inputPhone__error');
const submitBtn = document.querySelector('.form__button');
// test url
const testUrl = 'https://jsonplaceholder.typicode.com/users';

let name = '';
let email = '';
let phone = '';

inputs.forEach((item) => {
    item.addEventListener('blur', function() {
        let rule = this.dataset.rule;
        let value = this.value;
        let check = false;
        
        switch(rule) {

            // Name field check
            case 'name':
                let correctStr = /^[a-zA-Zа-яА-Я'][a-zA-Zа-яА-Я-' ]+[a-zA-Zа-яА-Я']?$/u.test(value);
                
                if(correctStr) {
                    let trimValue = value.trim();
                
                    let nameArr = trimValue.split(' ');
                    this.value = '';
    
                    nameArr.forEach((arrItem) => {
                        if(value) {
                            let uperLetter = arrItem[0].toUpperCase();
                            let firstLetterToUpper = uperLetter + arrItem.slice(1) + ' ';
                            this.value += firstLetterToUpper;
                            check = true;
                            nameError.innerHTML = '';
                            name = this.value;
                        }
                        
                        if(arrItem.length <= 2) {
                            nameError.innerHTML = 'ФИО должны быть полными!';
                            check = false;
                        }
                    })
                } else {
                    nameError.innerHTML = 'Поле должно содержать буквы!';
                    check = false;
                }

            break;

            // Email check
            case 'email':
                let trimEmail = value.trim();
                let emailCheck = /@gmail.com$/g.test(trimEmail);
                

                if(emailCheck) {
                    check = true;
                    emailError.innerHTML = '';
                    email = this.value;
                } else {
                    if(this.value === '') {
                        emailError.innerHTML = 'Поле обязательно для заполнения!';
                    } else {
                        check = false;
                        emailError.innerHTML = 'Email должен принадлежать домену gmail.com!';
                    }
                }

            break;

            // Phone check
            case 'phone':
                let trimPhone = value.trim();
                let phoneCheck = trimPhone.replace(/\D/g, "");

                if(phoneCheck.length < 7 || phoneCheck.length > 11) {
                    check - false;
                    phoneError.innerHTML = 'Телефон должен быть не менее 7 цифр и не более 11!';
                } else {
                    check = true;
                    phoneError.innerHTML = '';
                    phone = this.value;
                }

            break;
        }

        this.classList.remove('invalid');
        this.classList.remove('valid');

        if(check) {
            this.classList.add('valid')
        } else {
            this.classList.add('invalid')
        }

    })
})

submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    let isSend = false;

    let data = {
        name,
        email,
        phone
    }

    for(key in data) {
        if(!data[key]) {
            noField.classList.remove('successSend');
            noField.classList.add('required');
            noField.innerHTML = 'Заполните форму';
        } else {
            isSend = true;
            noField.innerHTML = '';
        }
    }

    if(isSend) {
        sendForm('POST', testUrl, data)
        .then(data => console.log(data))
        .catch(err => console.log(err));

        noField.classList.remove('required');
        noField.classList.add('successSend');
        noField.innerHTML = 'Форма отправлена';
    }
})

async function sendForm(method, url, data = null) {
    const headers = {
        'Content-Type': 'application/json'
    }

    let formData = {
        method: method,
        body: JSON.stringify(data),
        headers: headers
    }

    const response = await fetch(url, formData);
    try {
        return response.json();
    } catch(err) {
        let error = document.querySelector('.form__networkError');
        error.innerHTML = 'Что-то пошло не так((. Попробуйте еще раз.';
        console.log(err.name);
        console.log(err.message);
    }
}