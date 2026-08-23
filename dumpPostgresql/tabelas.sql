--
-- PostgreSQL database dump
--

\restrict iR0YJ4dEQjuPOnhPOQqmnuaFFPYlT12sbDLgw5NR4f0jjtJ8UKP9b18ARc9MR5e

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id bigint CONSTRAINT "Cadastros_id_not_null" NOT NULL,
    nome character varying(100) CONSTRAINT "Cadastros_nome_not_null" NOT NULL,
    email character varying(150),
    cidade character varying(100),
    telefone character varying(20),
    senha character varying(255) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: Cadastros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Cadastros_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Cadastros_id_seq" OWNER TO postgres;

--
-- Name: Cadastros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Cadastros_id_seq" OWNED BY public.usuarios.id;


--
-- Name: pdf_analises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pdf_analises (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    pdf_extract text,
    data timestamp without time zone DEFAULT now(),
    active boolean DEFAULT true NOT NULL,
    analise_ia text
);


ALTER TABLE public.pdf_analises OWNER TO postgres;

--
-- Name: pdf_analises_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pdf_analises_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pdf_analises_id_seq OWNER TO postgres;

--
-- Name: pdf_analises_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pdf_analises_id_seq OWNED BY public.pdf_analises.id;


--
-- Name: pdf_analises id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_analises ALTER COLUMN id SET DEFAULT nextval('public.pdf_analises_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public."Cadastros_id_seq"'::regclass);


--
-- Data for Name: pdf_analises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pdf_analises (id, user_id, pdf_extract, data, active, analise_ia) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nome, email, cidade, telefone, senha) FROM stdin;
\.


--
-- Name: Cadastros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Cadastros_id_seq"', 1, false);


--
-- Name: pdf_analises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pdf_analises_id_seq', 1, false);


--
-- Name: pdf_analises pdf_analises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_analises
    ADD CONSTRAINT pdf_analises_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: pdf_analises pdf_analises_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_analises
    ADD CONSTRAINT pdf_analises_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict iR0YJ4dEQjuPOnhPOQqmnuaFFPYlT12sbDLgw5NR4f0jjtJ8UKP9b18ARc9MR5e

