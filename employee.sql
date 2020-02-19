DROP DATABASE IF EXISTS staffCMS_db;
CREATE DATABASE staffCMS_db;
USE staffCMS_db;

CREATE TABLE department
(
  id INT NOT NULL
  AUTO_INCREMENT,
    name VARCHAR
  (30) NOT NULL,
    PRIMARY KEY
  (id)
);

  CREATE TABLE role
  (
    id INT NOT NULL
    AUTO_INCREMENT,
    title VARCHAR
    (30) NOT NULL,
    salary DECIMAL
    (10) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY
    (department_id)
		REFERENCES department
    (id),
    PRIMARY KEY
    (id)
);

    CREATE TABLE employee
    (
      id INT NOT NULL
      AUTO_INCREMENT,
    first_name VARCHAR
      (30) NOT NULL,
    last_name VARCHAR
      (30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT default 0,
    FOREIGN KEY
      (role_id)
        REFERENCES role
      (id),
	-- FOREIGN KEY (manager_id) --
-- 		REFERENCES employee(manager_id), --
    PRIMARY KEY
      (id)
-- );

-- INSERT INTO department (name)
-- VALUES ("Human Resources"), ("Finance"), ("Development"), ("IT"), ("Sales"), ("Marketing");

-- INSERT INTO role (title, salary, department_id)
-- VALUES ("HR Director", 175000, 1), ("CFO", 250000, 2), ("VP of Development", 240000, 3), ("Divisional VP", 350000, 4), ("Divisional VP", 350000, 5);

-- INSERT INTO employee (first_name, last_name, role_id)
-- VALUES ("Tyler", "Jenkins", 3), ("Tim", "Rogers", 4), ("Kim", "Wheeler", 4), ("Kevin", "Gacek", 2);