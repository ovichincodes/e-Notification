<h1 align="center">RESULT NOTIFICATION</h1>

## Requirements for this project
For this project to be up and running on your machine, you need to have the following already installed.
* Node JS runtime environment
* Mongo DB server
* A code editor for some changes you may like to make
* A web browser

<br>

## About e-Notification

e-Notification is a MERN (MongoDB ExpressJS React NodeJS) stack project that basically notifies registered students via email and sms about the release of a new result recently uploaded by their lecturer. This project has 3 types of users namely:
* Administrator or Admin for short
* Lecturers
* Students

<br>

## Administrator

The Administrator manages both the students and the lecturers. Below are some of the admin features.
* Login
* View all registered lecturers
* View all registered students
* Assign courses to lecturers
* Delete lecturers
* Delete students
* Add and view course, departments and sessions

<br>

## Lecturer
Some of the lecturers functions are enumerated below:
* Login
* Register
* Upload new result
* View all uploaded results
* Update profile

<br>

## Student
Some of the students functions are enumerated below:
* Login
* Register
* View results
* Update profile

<br>

After lecturers upload their course results, the system sends emails and SMS notification to the students registered in the application. Students, on receipt of either of these notifications, logs in to the application to view course results.

<br>

## Installing Application Dependencies
You need to install the dependencies for this application to run, open your terminal in the root of your application and follow the steps below.

* Type `cd backend` to enter the backend directory
* Type `npm install` to install the dependencies in the `package.json` file of the backend directory
* Type `cd ../frontend` to enter the frontend directory which is where the react js lives
* Once again, type `npm install` to install react dependencies in the `package.json` file of the frontend directory

<br>

## Starting Application
To run this application, open your terminal in the root of the application and type the following.

* `cd backend` element here instead.
* `npm run dev` to run both react and express server concurrently

<br>
<br>

## NOTE
For SMTP to use Gmail's server (smtp.gmail.com), you need to turn on **Less Secure App Access** in your google account.
It's not recommended and you will be notified by google but you need the email to work, after which you can turn it off. To turn **Less Secure App Access** on, follow the steps below:
* Open your google account and go to Manage account
* Go to security
* Look for **Less Secure App Access**
* Click **Turn on access (not recommended)**

And there you go.
<br>
<br>
You must have also created an account with [Bulk SMS Nigeria](https://www.bulksmsnigeria.com/register).

<br>

You can find sample of the excel file containing students results [HERE](./backend/public/uploads/1610364737207.xlsx)

<br>

# APP SCREENSHOTS
You can see some of the screens of the application [HERE](./screens)


Hope this helps someone, Many Thanks!
