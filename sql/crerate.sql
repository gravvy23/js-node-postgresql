CREATE schema projekt;
SET search_path to projekt;
-- Tworzenie tabel --
CREATE SEQUENCE bagaz_typ_id_seq;
CREATE TABLE bagaz_typ (
                id INTEGER NOT NULL DEFAULT nextval('bagaz_typ_id_seq'),
                opis VARCHAR(30) NOT NULL,
                limit_wagi REAL NOT NULL,
                cena NUMERIC(5,2) NOT NULL
);
ALTER TABLE bagaz_typ ADD primary key (id);
ALTER SEQUENCE bagaz_typ_id_seq OWNED BY bagaz_typ.id;


CREATE SEQUENCE uzytkownik_id_uzytkownik_seq_1;
CREATE TABLE uzytkownik (
                id_uzytkownik INTEGER NOT NULL DEFAULT nextval('uzytkownik_id_uzytkownik_seq_1'),
                login VARCHAR(30) NOT NULL,
                passwd VARCHAR(30) NOT NULL,
                imie VARCHAR(30) NOT NULL,
                nazwisko VARCHAR(40) NOT NULL,
                data_urodzenia DATE NOT NULL,
                narodowosc VARCHAR(3) NOT NULL,
                nr_dokumentu VARCHAR(10) NOT NULL
);
ALTER TABLE uzytkownik ADD primary key (id_uzytkownik);
ALTER SEQUENCE uzytkownik_id_uzytkownik_seq_1 OWNED BY uzytkownik.id_uzytkownik;


CREATE SEQUENCE pracownik_funkcja_id_funckja_seq;
CREATE TABLE pracownik_funkcja (
                id_funckja INTEGER NOT NULL DEFAULT nextval('pracownik_funkcja_id_funckja_seq'),
                opis VARCHAR(30) NOT NULL
);
ALTER TABLE pracownik_funkcja ADD primary key (id_funckja);
ALTER SEQUENCE pracownik_funkcja_id_funckja_seq OWNED BY pracownik_funkcja.id_funckja;


CREATE SEQUENCE pracownik_id_pracownik_seq;
CREATE TABLE pracownik (
                id_pracownik INTEGER NOT NULL DEFAULT nextval('pracownik_id_pracownik_seq'),
                login VARCHAR(30) NOT NULL,
                passwd VARCHAR(30) NOT NULL,
                imie VARCHAR(30) NOT NULL,
                nazwisko VARCHAR(40) NOT NULL,
                data_urodzenia DATE NOT NULL,
                data_rozpoczecia_pracy DATE NOT NULL,
                liczba_godzin REAL NOT NULL
);
ALTER TABLE pracownik ADD primary key (id_pracownik);
ALTER SEQUENCE pracownik_id_pracownik_seq OWNED BY pracownik.id_pracownik;



CREATE SEQUENCE samolot_id_samolot_seq_1;
CREATE TABLE samolot (
                id_samolot INTEGER NOT NULL DEFAULT nextval('samolot_id_samolot_seq_1'),
                producent VARCHAR(20) NOT NULL,
                model VARCHAR(20) NOT NULL,
                rok_produkcji INTEGER NOT NULL,
                liczba_zalogi INTEGER NOT NULL,
                l_miejsc_economy INTEGER NOT NULL,
                l_miejsc_business INTEGER NOT NULL
);
ALTER TABLE samolot ADD primary key (id_samolot);
ALTER SEQUENCE samolot_id_samolot_seq_1 OWNED BY samolot.id_samolot;


CREATE TABLE lotnisko (
                id_lotnisko VARCHAR(3) NOT NULL,
                miasto VARCHAR(40) NOT NULL,
                kraj VARCHAR(30) NOT NULL,
                wsp_x REAL NOT NULL,
                wsp_y REAL NOT NULL,
                wysokosc REAL NOT NULL,
                UTC INTEGER NOT NULL
);
ALTER TABLE lotnisko ADD primary key (id_lotnisko);



CREATE SEQUENCE trasa_id_trasa_seq_1;
CREATE TABLE trasa (
                id_trasa INTEGER NOT NULL DEFAULT nextval('trasa_id_trasa_seq_1'),
                id_lotnisko_start VARCHAR(3) NOT NULL,
                id_lotnisko_cel VARCHAR(3) NOT NULL,
                czas_lotu TIME NOT NULL
);
ALTER TABLE trasa ADD primary key (id_trasa);
ALTER SEQUENCE trasa_id_trasa_seq_1 OWNED BY trasa.id_trasa;



CREATE SEQUENCE rozklad_id_rozklad_seq;
CREATE TABLE rozklad (
                id_rozklad INTEGER NOT NULL DEFAULT nextval('rozklad_id_rozklad_seq'),
                id_trasa INTEGER NOT NULL,
                data DATE NOT NULL,
                godzina TIME NOT NULL
);
ALTER TABLE rozklad ADD primary key (id_rozklad, id_trasa);
ALTER SEQUENCE rozklad_id_rozklad_seq OWNED BY rozklad.id_rozklad;



CREATE TABLE rejs (
                nr_lotu VARCHAR(6) NOT NULL,
                id_rozklad INTEGER NOT NULL,
                id_trasa INTEGER NOT NULL,
                id_samolot INTEGER NOT NULL
);
ALTER TABLE rejs ADD primary key (nr_lotu);



CREATE TABLE miejsce (
                id_miejsce INTEGER NOT NULL,
                nr_lotu VARCHAR(6) NOT NULL,
                typ VARCHAR(1) NOT NULL,
                cena NUMERIC(7,2) NOT NULL,
                czy_zajete BOOLEAN NOT NULL,
                id_uzytkownik INTEGER,
                imie VARCHAR(30),
                nazwisko VARCHAR(40),
                data_urodzenia DATE,
                narodowosc VARCHAR(3)
);
ALTER TABLE miejsce ADD primary key (id_miejsce, nr_lotu);


CREATE SEQUENCE bagaz_id_bagaz_seq;
CREATE TABLE bagaz (
                id_bagaz INTEGER NOT NULL DEFAULT nextval('bagaz_id_bagaz_seq'),
                id_miejsce INTEGER NOT NULL,
                nr_lotu VARCHAR(6) NOT NULL,
                id_typ INTEGER NOT NULL
);
ALTER TABLE bagaz ADD primary key (id_bagaz, id_miejsce, nr_lotu);
ALTER SEQUENCE bagaz_id_bagaz_seq OWNED BY bagaz.id_bagaz;



CREATE TABLE pracownik_rejs (
                id_pracownik INTEGER NOT NULL,
                nr_lotu VARCHAR(6) NOT NULL,
                id_funckja INTEGER NOT NULL
);
ALTER TABLE pracownik_rejs ADD primary key (id_pracownik, nr_lotu);


-- modyfikacja tabel - dodanie refencji klucza obcego --
ALTER TABLE bagaz ADD FOREIGN KEY (id_typ) REFERENCES bagaz_typ (id);
ALTER TABLE miejsce ADD FOREIGN KEY (id_uzytkownik) REFERENCES uzytkownik (id_uzytkownik);
ALTER TABLE pracownik_rejs ADD FOREIGN KEY (id_funckja) REFERENCES pracownik_funkcja (id_funckja);
ALTER TABLE pracownik_rejs ADD FOREIGN KEY (id_pracownik) REFERENCES pracownik (id_pracownik);
ALTER TABLE rejs ADD FOREIGN KEY (id_samolot) REFERENCES samolot (id_samolot);
ALTER TABLE trasa ADD FOREIGN KEY (id_lotnisko_start) REFERENCES lotnisko (id_lotnisko);
ALTER TABLE trasa ADD FOREIGN KEY (id_lotnisko_cel) REFERENCES lotnisko (id_lotnisko);
ALTER TABLE rozklad ADD FOREIGN KEY (id_trasa) REFERENCES trasa (id_trasa);
ALTER TABLE rejs ADD FOREIGN KEY (id_trasa, id_rozklad) REFERENCES rozklad (id_trasa, id_rozklad);
ALTER TABLE pracownik_rejs ADD FOREIGN KEY (nr_lotu) REFERENCES rejs (nr_lotu);
ALTER TABLE miejsce ADD FOREIGN KEY (nr_lotu) REFERENCES rejs (nr_lotu);
ALTER TABLE bagaz ADD FOREIGN KEY (id_miejsce, nr_lotu) REFERENCES miejsce (id_miejsce, nr_lotu);
