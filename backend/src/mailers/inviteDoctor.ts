import Patient from '../api/patient/interface';
import { get } from 'lodash';

export default (patient: Patient): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <h1>Invite from parent ${get(patient, 'parent.firstName')} ${get(patient, 'parent.lastName')} with email: ${get(patient, 'parent.user.email')}</h1>
</body>
</html>
`;