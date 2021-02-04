# Getting Started with Shift Client

Initialize whole npm modules first before proceeding. Use npm install.
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Browser load create-react-app (typescript) in PORT 3200 (edit package.json to change the port, find "start" section)

### `npm test`

Launches test cases for this web client. No test case has been built so far so it still follows default test case from create-react-app.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## App Workflow

This app consists of three pages: home('/'), calendar('/calendar), and shift('/shift').

This app doesn't have authentication module so you need to select trainee in the home page before continue to the other pages. You can seed the database from the server repo https://github.com/tanjungtech/shift-service (cd seeds; node initAccount.js and node initSchedule.js). Then, select the trainee and create a new shift.

Calendar page will show the whole shifts created and published by staff. It shows weekly format calendar with rows starting from 00.00 to 23.59 column ranging from  mon to sun. Create a new shift by clicking inside the calendar. Shift form will be appeared if the cursor is fired within empty area. It won't create a new shift if the cursor is fired in an area that has shift booked.

Shift page is a shift management panel for staff. Staff can view shifts that has been created in a week (can go to the next and previous). Staff can also create, update, and delete shift. Click the +shift button in the top of panel and create new shift form will appear. To update shift, staff need to click the 'pencil' icon button on each shift listed. To delete shift, click the 'trash' icon button and click confirmation button.

Shift form consists of two buttons: create/update and publish. Create/update will create/modify the shift information by date, time, and notes. Publish will generate shift schedule within a whole week, started from the start date. If the start date is tue, then publish will automatically generate shifts from tue to sun within the same time period (e.g. 02.00 to 04.00). Once the shift is published, staff can edit the schedule but cannot re-publish.

There might be some missing requirements but this app covers most of aspects required for managing shift. This app is not yet mobile responsive, only available for desktop client in terms of usability.
