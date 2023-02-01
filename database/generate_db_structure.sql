-- public."domain" definition

-- Drop table

-- DROP TABLE public."domain";

CREATE TABLE public."domain" (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	unique_label varchar(50) NOT NULL,
	repo_url varchar(50) NULL,
	tool_annotations_file_name varchar(50) NULL,
	ontology_file_name varchar(50) NULL,
	docker_image_url varchar(50) NULL,
	public bool NOT NULL DEFAULT true,
	CONSTRAINT "PK_domain" PRIMARY KEY (id),
	CONSTRAINT "UQ_domain__unique_label" UNIQUE (unique_label)
);


-- public."permission" definition

-- Drop table

-- DROP TABLE public."permission";

CREATE TABLE public."permission" (
	id int4 NOT NULL,
	unique_label varchar(50) NOT NULL,
	permission_level int4 NOT NULL,
	description varchar(100) NULL,
	CONSTRAINT "PK_permission" PRIMARY KEY (id),
	CONSTRAINT "UQ_permission__unique_label" UNIQUE (unique_label)
);


-- public."role" definition

-- Drop table

-- DROP TABLE public."role";

CREATE TABLE public."role" (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	unique_label varchar(50) NOT NULL,
	description varchar(100) NULL,
	CONSTRAINT "PK_roles" PRIMARY KEY (id),
	CONSTRAINT "UQ_role__unique_label" UNIQUE (unique_label)
);


-- public."user" definition

-- Drop table

-- DROP TABLE public."user";

CREATE TABLE public."user" (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	first_name varchar(50) NULL,
	last_name varchar(50) NULL,
	affiliation varchar(50) NULL,
	orchid_id varchar(50) NOT NULL,
	archived bool NOT NULL DEFAULT false,
	email varchar(50) NOT NULL,
	created_date date NOT NULL DEFAULT CURRENT_DATE,
	username varchar(50) NOT NULL,
	CONSTRAINT "PK_user" PRIMARY KEY (id),
	CONSTRAINT "UQ_user_username" UNIQUE (username)
);


-- public.role_permission definition

-- Drop table

-- DROP TABLE public.role_permission;

CREATE TABLE public.role_permission (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	role_id_fk int4 NOT NULL,
	permission_id_fk int4 NOT NULL,
	CONSTRAINT "PK_role_permission" PRIMARY KEY (id),
	CONSTRAINT "FK_role_permission__permission" FOREIGN KEY (permission_id_fk) REFERENCES public."permission"(id),
	CONSTRAINT "FK_role_permission__role" FOREIGN KEY (role_id_fk) REFERENCES public."role"(id)
);


-- public.topic_of_research definition

-- Drop table

-- DROP TABLE public.topic_of_research;

CREATE TABLE public.topic_of_research (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	unique_label varchar(50) NOT NULL,
	description varchar(100) NULL,
	permission_id_required int4 NOT NULL,
	CONSTRAINT "PK_topic_of_research" PRIMARY KEY (id),
	CONSTRAINT "UQ_topic_of_research__unique_label" UNIQUE (unique_label),
	CONSTRAINT "FK_topic_of_research__permission" FOREIGN KEY (permission_id_required) REFERENCES public."permission"(id)
);
CREATE INDEX "fki_FK_topic_of_research__permission" ON public.topic_of_research USING btree (permission_id_required);


-- public.user_roles definition

-- Drop table

-- DROP TABLE public.user_roles;

CREATE TABLE public.user_roles (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	user_id int4 NOT NULL,
	role_id int4 NOT NULL,
	CONSTRAINT "PK_user_roles" PRIMARY KEY (id),
	CONSTRAINT "FK_user_roles__role" FOREIGN KEY (role_id) REFERENCES public."role"(id),
	CONSTRAINT "FK_user_roles__user" FOREIGN KEY (user_id) REFERENCES public."user"(id)
);


-- public.doman_topics definition

-- Drop table

-- DROP TABLE public.doman_topics;

CREATE TABLE public.doman_topics (
	domain_id int4 NOT NULL,
	topic_id int4 NOT NULL,
	CONSTRAINT "PK_doman_topics" PRIMARY KEY (domain_id, topic_id),
	CONSTRAINT "FK_doman_topics__domain" FOREIGN KEY (domain_id) REFERENCES public."domain"(id),
	CONSTRAINT "FK_doman_topics__topic" FOREIGN KEY (topic_id) REFERENCES public.topic_of_research(id)
);