<!doctype html>

<?php
    session_start();
?>

<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/images/logo.png" />
        <link href="./styles/style.css" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Detective Timeline</title>
    </head>
    <body>
        <header>
            <section style="display: flex;">
                <a href="./index.html"><img src="./images/logo.png" id="logo" /></a>
                <img src="./images/menu.png" id="mobileMenuButton" />
                <img src=<?php echo isset($_SESSION['id'])&&!empty($_SESSION['id'])?"./images/logout.png":"./images/login.png" ?> id="loginButton" />
            </section>
            <form id='addEventForm'>
                <section>
                    <label for="title">Title</label>
                    <input type='text' id='title' required />
                </section>

                <section>
                    <label for="date">Date</label>
                    <input type='time' id='time' required />
                    <input type='date' id='date' required />
                </section>

                <section>
                    <label for="description">Additional informations</label>
                    <input type='text' id='description' />
                </section>

                <input type='submit' value="Add Event" id="submit" />
            </form>
            <section id='loginCreateAccountSection' style='display: none;'>
                <form id='loginForm' action='./api/login.php' method='post'>
                    <h2>Login</h2>

                    <label for='loginEmail'>Email</label>
                    <input type='email' id='loginEmail' name='email' />

                    <label for='loginPassword'>Password</label>
                    <input type='password' id='loginPassword' name='password' />

                    <p>Don't have an account? <a id='signUpButton'>Sign Up!</a></p>

                    <input type='submit' value='Login' id='loginSubmit' />
                </form>
                <form id='createAccountForm' action='./api/createAccount.php' method='post' style='display: none;'>
                    <h2>Create Account</h2>

                    <label for='createAccountEmail'>Email</label>
                    <input type='email' id='createAccountEmail' name='email' />

                    <label for='createAccountPassword'>Password</label>
                    <input type='password' id='createAccountPassword' name='password' />

                    <p>Already have an account? <a id='loginSwitchButton'>Login!</a></p>

                    <input type='submit' value='Create Account' id='createAccountSubmit' />
                </form>
            </section>
        </header>
        <main>

        </main>

        <script src="/scripts/main.js"></script>
    </body>
</html>