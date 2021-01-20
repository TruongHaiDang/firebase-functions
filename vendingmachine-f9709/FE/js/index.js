$(document).ready(function () {
    const firebaseConfig = {
        apiKey: "AIzaSyCVc4J5R1wJX96V3m495qZmHHaMnx_xKSI",
        authDomain: "vendingmachine-f9709.firebaseapp.com",
        databaseURL: "https://vendingmachine-f9709.firebaseio.com",
        projectId: "vendingmachine-f9709",
        storageBucket: "vendingmachine-f9709.appspot.com",
        messagingSenderId: "599808194350",
        appId: "1:599808194350:web:fa5814e8279dfb973bacbf",
        measurementId: "G-JWJW86LHEW"
    };

    firebase.initializeApp(firebaseConfig);
    firebase.auth().languageCode = 'en';

    var recaptchaVerifier = new firebase.auth.RecaptchaVerifier('reCaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
            console.log('response', response)
        }
    });
    recaptchaVerifier.render();
    var confirmationResult;

    function sendEmailVerification() {  
        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function() {
            console.log("Email is sent")
        }).catch(function(error) {
            console.log(error)
        });
    }

    $("#phonesignin").click(function (e) { 
        e.preventDefault();
        let phoneNumber = $("#phone-numbers").val();
        firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
                .then((confirResult) => {
                    confirmationResult = confirResult;
                    console.log('confirResult', confirResult)
                }).catch((error) => {
                    console.log(error);
                    grecaptcha.reset(window.recaptchaWidgetId);
                    window.recaptchaVerifier.render().then(function(widgetId) {
                        grecaptcha.reset(widgetId);
                    })
                });
    });

    $("#verifycode").click(function (e) { 
        e.preventDefault();
        let verifyCode = $("#verify-code").val();
        confirmationResult.confirm(verifyCode)
                            .then((result) => {
                                console.log('result', result)
                            })
                            .catch((error) => {
                                console.log(error)
                            })
    });

    $("#emailsignup").click(function (e) { 
        e.preventDefault();
        let email = $("#email").val();
        let password = $("#password").val();
        firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    console.log(user)
                })
                .catch((error) => {
                    console.log(error)
                });
    });

    $("#emailsignin").click(function (e) { 
        e.preventDefault();
        let email = $("#email").val();
        let password = $("#password").val();
        firebase.auth().signInWithEmailAndPassword(email, password)
                .then((user) => {
                    console.log(user);
                    sendEmailVerification();
                })
                .catch((error) => {
                    console.log(error)
                });
    });

    $("#signout").click(function (e) { 
        e.preventDefault();
        firebase.auth().signOut().then((result) => {
            console.log(result)
        }).catch((error) => {
            console.log(error)
        });
    });
});
