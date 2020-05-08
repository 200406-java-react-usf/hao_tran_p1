Project 1 - Expense Reimbursement System

	Executive Summary

The Expense Reimbursement System (ERS) will manage the process of reimbursing employees for expenses incurred while on company time. All employees in the company can login and submit requests for reimbursement and view their past tickets and pending requests. Finance managers can log in and view all reimbursement requests and past history for all employees in the company. Finance managers are authorized to approve and deny requests for expense reimbursement.



	Reimbursement Status State Flow Diagram

![](src/static/images/p1_reimbursment_status_state_flow_diagram.png)


	Reimbursement Types

Employees must select the type of reimbursement as: 

- LODGING
- TRAVEL
- FOOD
- OTHER

		ERS Relational Model

![](src/static/images/p1_ers_relational_model.png)


		Notes on the relational model

- The receipt images can either be stored in one of two ways:

    1. As a BLOB data type within the database
    2. As a link that points to the object stored in an AWS S3 bucket (properly secured)

- Passwords should be hashed before being stored within the database (optional)


		ERS Use Case Diagram

![](src/static/images/p1_ers_use_case_diagram.png)


		Technical Requirements

- Persistence Tier
	PostGreSQL
	AWS Simple Storage Service (optional for receipt image storage)

- Application Tier
	Environment: NodeJS
	Language: TypeScript
	Web Framework: Express
	Authentication Strategy (choose one): 
	Server-side session management with express-session
	Client-side session management with JWTs

- Client Tier
	Environment: Browser
	Language(s): HTML, CSS, and either JS or TS
	Styling Framework: Bootstrap



	Non-Functional Requirements

- Persistence Tier
	Database is deployed to an AWS RDS instance
	The provided relational model is adhered to
	If AWS S3 is leverage the bucket must be properly secured

- Application Tier
	API is deployed to an AWS EC2 instance
	API leverages a web request logging framework
	All methods are properly documented
	Entire application has a minimum of 80% unit test coverage
	(Optional) API leverages a general purpose logging framework
	(Optional) All passwords are hashed before being stored in the data source

- Client Tier
	UI is deployed to an AWS S3 bucket configured for static web hosting
(Optional) UI is implemented with React

- Operations Layer
	Development workflow will be augmented by a CI/CD pipeline
