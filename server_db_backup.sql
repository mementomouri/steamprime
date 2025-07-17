--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-1.pgdg22.04+1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: morteza
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "brandColor" text,
    "position" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Category" OWNER TO morteza;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: morteza
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO morteza;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: morteza
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Price; Type: TABLE; Schema: public; Owner: morteza
--

CREATE TABLE public."Price" (
    id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "productId" integer NOT NULL,
    color text,
    storage text,
    warranty text,
    label text
);


ALTER TABLE public."Price" OWNER TO morteza;

--
-- Name: Price_id_seq; Type: SEQUENCE; Schema: public; Owner: morteza
--

CREATE SEQUENCE public."Price_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Price_id_seq" OWNER TO morteza;

--
-- Name: Price_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: morteza
--

ALTER SEQUENCE public."Price_id_seq" OWNED BY public."Price".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: morteza
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    name text NOT NULL,
    "categoryId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    description text
);


ALTER TABLE public."Product" OWNER TO morteza;

--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: morteza
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Product_id_seq" OWNER TO morteza;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: morteza
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: morteza
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO morteza;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: morteza
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO morteza;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: morteza
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: morteza
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO morteza;

--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: morteza
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Price id; Type: DEFAULT; Schema: public; Owner: morteza
--

ALTER TABLE ONLY public."Price" ALTER COLUMN id SET DEFAULT nextval('public."Price_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: morteza
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: morteza
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: morteza
--

COPY public."Category" (id, name, "createdAt", "updatedAt", "brandColor", "position") FROM stdin;
24	NOKIA	2025-07-12 14:22:50.007	2025-07-13 13:41:20.223	bg-orange-700	6
14	ACCESSORIES MOTOROLA	2025-07-12 11:57:41.595	2025-07-13 13:41:20.223	bg-amber-700	7
15	MOTOROLA	2025-07-12 11:58:00.124	2025-07-13 13:41:20.223	bg-yellow-600	8
16	GOOGLE	2025-07-12 11:58:15.325	2025-07-13 13:41:20.223	bg-lime-600	9
17	ACCESSORIES NOTHING	2025-07-12 11:58:25.772	2025-07-13 13:41:20.223	bg-green-700	10
18	NOTHING	2025-07-12 11:58:53.275	2025-07-13 13:41:20.223	bg-emerald-700	11
19	ACCESSORIES XIAOMI	2025-07-12 11:59:08.524	2025-07-13 13:41:20.223	bg-teal-700	12
22	ACCESSORIES ONE PLUS	2025-07-12 11:59:50.363	2025-07-13 13:41:20.223	bg-blue-700	13
20	Tab Xiaomi	2025-07-12 11:59:18.739	2025-07-13 13:41:20.223	bg-cyan-700	14
25	XIAOMI	2025-07-12 14:24:29.595	2025-07-13 13:41:20.223	bg-sky-700	15
23	ONE PLUS	2025-07-12 11:59:58.5	2025-07-13 13:41:20.223	bg-blue-700	16
26	 ACCESSORIES ONE PLUS	2025-07-12 14:24:59.883	2025-07-13 13:41:20.223	bg-indigo-700	17
9	ACCESSORIES SAMSUNG	2025-07-12 11:56:04.324	2025-07-13 13:41:20.223	bg-slate-700	2
10	SAMSUNG	2025-07-12 11:56:36.58	2025-07-13 13:41:20.223	bg-gray-700	3
11	HUAWEI	2025-07-12 11:57:08.076	2025-07-13 13:41:20.223	bg-red-700	4
12	REALME	2025-07-12 11:57:17.379	2025-07-13 13:41:20.223	bg-rose-700	5
8	APPLE	2025-07-12 11:55:37.54	2025-07-16 02:06:43.168	bg-zinc-700	1
7	ACCESSORIES APPLE	2025-07-12 11:55:17.517	2025-07-16 13:03:46.54	bg-stone-700	0
\.


--
-- Data for Name: Price; Type: TABLE DATA; Schema: public; Owner: morteza
--

COPY public."Price" (id, amount, "createdAt", "productId", color, storage, warranty, label) FROM stdin;
4	42500000.00	2025-07-16 02:06:43.166	18	WHITE	128	YES	اصلی
5	150000.00	2025-07-16 13:03:46.537	19	\N	\N	\N	تایپ سی
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: morteza
--

COPY public."Product" (id, name, "categoryId", "createdAt", "updatedAt", description) FROM stdin;
15	iphone 14 promax	7	2025-07-12 14:56:34.344	2025-07-12 14:56:34.344	\N
16	iphone 14 max	8	2025-07-12 17:42:35.477	2025-07-12 17:42:35.477	\N
17	iphone 14 max	7	2025-07-12 17:43:29.077	2025-07-13 17:10:47.733	\N
18	IPHONE 13	8	2025-07-16 02:06:43.158	2025-07-16 02:06:43.158	\N
19	کابل	7	2025-07-16 13:03:46.533	2025-07-16 13:03:46.533	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: morteza
--

COPY public."User" (id, email, password, "createdAt") FROM stdin;
1	seyedmouri@gmail.com	$2b$12$9m5zkREPH/hBYJH5D.KOLO6QI2w8UaMj/R66mZVxVvuixCVha3maq	2025-07-12 18:10:41.479
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: morteza
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
\.


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: morteza
--

SELECT pg_catalog.setval('public."Category_id_seq"', 26, true);


--
-- Name: Price_id_seq; Type: SEQUENCE SET; Schema: public; Owner: morteza
--

SELECT pg_catalog.setval('public."Price_id_seq"', 5, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: morteza
--

SELECT pg_catalog.setval('public."Product_id_seq"', 19, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: morteza
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: morteza
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Price Price_pkey; Type: CONSTRAINT; Schema: public; Owner: morteza
--

ALTER TABLE ONLY public."Price"
    ADD CONSTRAINT "Price_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: morteza
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: morteza
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: morteza
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: morteza
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: morteza
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Price Price_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: morteza
--

ALTER TABLE ONLY public."Price"
    ADD CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: morteza
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

