--widoki
--
--widok tabeli lotnisko
CREATE VIEW lotnisko_view AS
SELECT id_lotnisko, miasto, kraj, utc FROM lotnisko;

--widok tabeli miejsce
CREATE VIEW miejsce_view AS
SELECT id_miejsce, nr_lotu, typ, cena, czy_zajete FROM miejsce;

--widok tabeli uzytkownik
CREATE VIEW uzytkownik_view AS
SELECT id_uzytkownik, imie, nazwisko, data_urodzenia, narodowosc FROM uzytkownik;

--widok tabeli pracownik
CREATE VIEW pracownik_view AS
SELECT id_pracownik, imie, nazwisko, data_urodzenia FROM pracownik;

--funkcje 
--

-------------------------
-------------------------
CREATE OR REPLACE FUNCTION UC01 ()
RETURNS TABLE(city VARCHAR, abbr VARCHAR) AS
$$
BEGIN
	RETURN QUERY
		SELECT l.miasto, l.id_lotnisko from projekt.lotnisko_view l
		ORDER BY l.miasto;
END;
$$ LANGUAGE 'plpgsql';

-------------------------
-------------------------
CREATE OR REPLACE FUNCTION UC02 (id_airport varchar(3))
RETURNS TABLE(city VARCHAR, abbr VARCHAR, route INT) AS
$$
BEGIN
	RETURN QUERY
		SELECT l.miasto, l.id_lotnisko, t.id_trasa from projekt.lotnisko_view l
		JOIN projekt.trasa t
		ON l.id_lotnisko = t.id_lotnisko_cel
		WHERE t.id_lotnisko_start = id_airport
		ORDER BY l.miasto;
END;
$$ LANGUAGE 'plpgsql';

------------------------
------------------------
CREATE OR REPLACE FUNCTION UC03 (trasa integer, month integer)
RETURNS TABLE(lot VARCHAR, data date, cena_minimalna DECIMAL(7,2)) AS
$$
DECLARE
	query TEXT; 
	rec RECORD;
BEGIN
	FOR rec IN (SELECT	rejs.nr_lotu, rozklad.data from projekt.rejs rejs
		JOIN projekt.rozklad  rozklad USING (id_rozklad)
		WHERE rejs.id_trasa = trasa AND
		EXTRACT(MONTH FROM rozklad.data) = month
		ORDER BY rozklad.data)
	LOOP
		lot := rec.nr_lotu;
		data := rec.data;
		query = 'SELECT * FROM projekt.uc05($1)';
		EXECUTE query INTO cena_minimalna USING lot;
		RETURN NEXT;
	END LOOP;
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC04 (lot VARCHAR)
RETURNS TABLE(id INT, cena DECIMAL(7,2), typ VARCHAR(1)) AS
$$
BEGIN
	RETURN QUERY
		SELECT mv.id_miejsce, mv.cena, mv.typ FROM projekt.miejsce_view mv WHERE
		mv.nr_lotu = lot AND mv.czy_zajete = 'false'
		ORDER BY mv.id_miejsce;
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC05 (lot VARCHAR)
RETURNS DECIMAL(7,2) AS
$$
DECLARE
	query TEXT;
	cena_minimalna DECIMAL(7,2);
BEGIN
	query = 'SELECT MIN(cena) FROM projekt.uc04($1)';
	EXECUTE query INTO cena_minimalna USING $1;
	RETURN cena_minimalna;
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC06 (lot VARCHAR, miejsce INT)
RETURNS DECIMAL(7,2) AS
$$
DECLARE
	cena_miejsca DECIMAL(7,2);
BEGIN
	SELECT cena INTO cena_miejsca FROM projekt.miejsce_view mv 
	WHERE mv.id_miejsce = miejsce AND mv.nr_lotu = lot;
	RETURN cena_miejsca;
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC07 (uzytkownik INT)
RETURNS TABLE(rejs VARCHAR, start VARCHAR, cel VARCHAR, utc_diff INT, data DATE, godzina TIME, czas_lotu TIME, nazwisko VARCHAR) AS
$$
DECLARE
	utc_start INT;
	utc_end INT;
	rec RECORD;
BEGIN
	FOR rec IN (SELECT DISTINCT m.nr_lotu, t.id_lotnisko_start, t.id_lotnisko_cel, r.data, r.godzina, t.czas_lotu, uv.nazwisko FROM projekt.miejsce m 
		JOIN projekt.uzytkownik_view uv USING(id_uzytkownik)
		JOIN projekt.rejs roz USING (nr_lotu)
		JOIN projekt.rozklad r USING (id_rozklad, id_trasa)
		JOIN projekt.trasa t USING (id_trasa)
		WHERE uv.id_uzytkownik = uzytkownik
		ORDER BY r.data, r.godzina)
	LOOP
		SELECT lv.utc INTO utc_start FROM projekt.lotnisko_view lv WHERE lv.id_lotnisko = rec.id_lotnisko_start;
		SELECT lv.utc INTO utc_end FROM projekt.lotnisko_view lv WHERE lv.id_lotnisko = rec.id_lotnisko_cel;
		rejs := rec.nr_lotu;
		start := rec.id_lotnisko_start;
		cel := rec.id_lotnisko_cel;
		utc_diff := utc_end - utc_start;
		data := rec.data;
		godzina := rec.godzina;
		czas_lotu := rec.czas_lotu;
		nazwisko := UPPER(rec.nazwisko);
		RETURN NEXT;
	END LOOP;
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC08 (uzytkownik INT, rejs VARCHAR)
RETURNS TABLE(imie VARCHAR, nazwisko VARCHAR, miejsce INT, klasa VARCHAR, bagaz_maly INT, bagaz_sredni INT, bagaz_duzy INT) AS
$$
DECLARE
	rec RECORD;
BEGIN
	FOR rec IN (SELECT m.imie, m.nazwisko, mv.id_miejsce, mv.typ FROM projekt.miejsce_view mv
		JOIN projekt.miejsce m USING(id_miejsce, nr_lotu)
		JOIN projekt.uzytkownik_view uv USING(id_uzytkownik)
		WHERE m.czy_zajete = 'true' AND uv.id_uzytkownik = uzytkownik AND m.nr_lotu = rejs)
	LOOP
		SELECT COUNT(*) INTO bagaz_maly FROM projekt.bagaz b
			WHERE b.id_miejsce = rec.id_miejsce AND b.nr_lotu = rejs AND b.id_typ = 1;
		SELECT COUNT(*) INTO bagaz_sredni FROM projekt.bagaz b
			WHERE b.id_miejsce = rec.id_miejsce AND b.nr_lotu = rejs AND b.id_typ = 2;
		SELECT COUNT(*) INTO bagaz_duzy FROM projekt.bagaz b
			WHERE b.id_miejsce = rec.id_miejsce AND b.nr_lotu = rejs AND b.id_typ = 3;
		imie := rec.imie;
		nazwisko := rec.nazwisko;
		miejsce := rec.id_miejsce;
		klasa := rec.typ;
		RETURN NEXT;
	END LOOP;
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC09 (login_uzytkownika VARCHAR)
RETURNS BOOLEAN AS
$$
DECLARE
	czy_istnieje BOOLEAN;
BEGIN
	SELECT EXISTS (SELECT 1 FROM projekt.uzytkownik_view uv
						JOIN projekt.uzytkownik u USING (id_uzytkownik)
						WHERE u.login = login_uzytkownika ) INTO czy_istnieje;
	RETURN czy_istnieje;
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC10 (pracownik INT)
RETURNS TABLE(rejs VARCHAR, start VARCHAR, cel VARCHAR, utc_diff INT, data DATE, godzina TIME, czas_lotu TIME, typ_samolotu VARCHAR, funkcja VARCHAR, imie VARCHAR, nazwisko VARCHAR) AS
$$
DECLARE
	utc_start INT;
	utc_end INT;
	rec RECORD;
BEGIN
	FOR rec IN (SELECT pv.imie, pv.nazwisko, rejs.nr_lotu, t.id_lotnisko_start, t.id_lotnisko_cel, r.data, r.godzina, t.czas_lotu, s.producent, s.model FROM projekt.pracownik_view pv
		JOIN projekt.pracownik_rejs pr USING (id_pracownik)
		JOIN projekt.rejs rejs USING (nr_lotu)
		JOIN projekt.rozklad r USING (id_rozklad, id_trasa)
		JOIN projekt.trasa t USING (id_trasa)
		JOIN projekt.samolot s USING (id_samolot)
		WHERE pv.id_pracownik = pracownik
		ORDER BY r.data, r.godzina)
	LOOP
		SELECT lv.utc INTO utc_start FROM projekt.lotnisko_view lv WHERE lv.id_lotnisko = rec.id_lotnisko_start;
		SELECT lv.utc INTO utc_end FROM projekt.lotnisko_view lv WHERE lv.id_lotnisko = rec.id_lotnisko_cel;
		SELECT pf.opis INTO funkcja FROM projekt.pracownik_funkcja pf
			JOIN projekt.pracownik_rejs pr USING (id_funckja)
			WHERE pr.id_pracownik = pracownik AND pr.nr_lotu = rec.nr_lotu;
		rejs := rec.nr_lotu;
		start := rec.id_lotnisko_start;
		cel := rec.id_lotnisko_cel;
		utc_diff := utc_end - utc_start;
		data := rec.data;
		godzina := rec.godzina;
		czas_lotu := rec.czas_lotu;
		typ_samolotu := rec.producent || ' ' || rec.model;
		imie := rec.imie;
		nazwisko := rec.nazwisko;
		RETURN NEXT;
	END LOOP;
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC11 (pracownik INT, rejs VARCHAR)
RETURNS TABLE(kraj_start VARCHAR, miasto_start VARCHAR, utc_start INT, x_start REAL, y_start REAL, wysokosc_start REAL,
kraj_cel VARCHAR, miasto_cel VARCHAR, utc_cel INT, x_cel REAL, y_cel REAL, wysokosc_cel REAL,
producent VARCHAR, model VARCHAR, rok_produkcji INT, l_zalogi INT, l_pasazerow INT, funkcja VARCHAR) AS
$$
DECLARE
	rec RECORD;
BEGIN
	FOR rec IN (SELECT ls.kraj AS kraj_start, ls.miasto AS miasto_start, ls.utc AS utc_start, ls.wsp_x AS x_start, ls.wsp_y AS y_start, ls.wysokosc AS wysokosc_start,
				lc.kraj AS kraj_cel, lc.miasto AS miasto_cel, lc.utc AS utc_cel, lc.wsp_x AS x_cel, lc.wsp_y AS y_cel, lc.wysokosc AS wysokosc_cel,
				s.producent, s.model, s.rok_produkcji, s.liczba_zalogi, s.l_miejsc_economy, s.l_miejsc_business, pf.opis FROM projekt.rejs r 
				JOIN projekt.pracownik_rejs pr USING(nr_lotu)
				JOIN projekt.pracownik_funkcja pf USING(id_funckja)
				JOIN projekt.pracownik_view pv USING (id_pracownik)
				JOIN projekt.rozklad roz USING(id_rozklad,id_trasa)
				JOIN projekt.trasa t USING(id_trasa)
				JOIN projekt.lotnisko ls ON t.id_lotnisko_start = ls.id_lotnisko
				JOIN projekt.lotnisko lc ON t.id_lotnisko_cel = lc.id_lotnisko
				JOIN projekt.samolot s USING(id_samolot)
				WHERE pv.id_pracownik = pracownik AND r.nr_lotu = rejs)
	LOOP
		kraj_start := rec.kraj_start;
		miasto_start := rec.miasto_start;
		utc_start := rec.utc_start;
		x_start := rec.x_start;
		y_start := rec.y_start;
		wysokosc_start := rec.wysokosc_start;
		kraj_cel := rec.kraj_cel;
		miasto_cel := rec.miasto_cel;
		utc_cel := rec.utc_cel;
		x_cel := rec.x_cel;
		y_cel := rec.y_cel;
		wysokosc_cel := rec.wysokosc_cel;
		producent := rec.producent;
		model := rec.model;
		rok_produkcji := rec.rok_produkcji;
		l_zalogi := rec.liczba_zalogi;
		l_pasazerow := rec.l_miejsc_economy + rec.l_miejsc_business;
		funkcja := rec.opis;
		RETURN NEXT;
	END LOOP;
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC12 ()
RETURNS TABLE(nazwa VARCHAR, limit_wagi REAL, cena DECIMAL(5,2)) AS
$$
BEGIN
	RETURN QUERY
		SELECT bt.opis, bt.limit_wagi, bt.cena FROM projekt.bagaz_typ bt
		ORDER BY bt.cena;
END;
$$ LANGUAGE 'plpgsql';


---------------------
---------------------
CREATE OR REPLACE FUNCTION UC13(uzytkownik INT, lot VARCHAR)
RETURNS BOOLEAN AS
$$
BEGIN
	UPDATE projekt.miejsce
	SET czy_zajete = 'false'
	WHERE id_uzytkownik = uzytkownik AND nr_lotu = lot;
	RETURN 'true';
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC14(uzytkownik INT, lot VARCHAR, miej INT, im VARCHAR, nazw VARCHAR, du DATE, nar VARCHAR)
RETURNS BOOLEAN AS
$$
BEGIN
	UPDATE projekt.miejsce
	SET czy_zajete = 'true', id_uzytkownik = uzytkownik, imie = im, nazwisko = nazw, data_urodzenia = du, narodowosc = nar
	WHERE nr_lotu = lot AND id_miejsce = miej;
	RETURN 'true';
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC15(lot VARCHAR, miej INT, typ INT, uzytkownik INT)
RETURNS BOOLEAN AS
$$
BEGIN
	IF EXISTS(SELECT 1 FROM projekt.miejsce m WHERE m.nr_lotu = lot AND m.id_miejsce = miej AND m.czy_zajete = 'true' AND m.id_uzytkownik = uzytkownik) THEN
		INSERT INTO projekt.bagaz(id_miejsce, nr_lotu, id_typ) VALUES (miej,lot, typ);		
		RETURN 'true';
	ELSE
		RETURN 'false';
	END IF;
END;
$$ LANGUAGE 'plpgsql';


---------------------
---------------------
CREATE OR REPLACE FUNCTION UC16 (lot VARCHAR)
RETURNS TABLE(imie VARCHAR, nazwisko VARCHAR, funkcja VARCHAR) AS
$$
BEGIN
	RETURN QUERY
		SELECT pv.imie, pv.nazwisko, pf.opis FROM projekt.pracownik_view pv
		JOIN projekt.pracownik_rejs pr USING(id_pracownik)
		JOIN projekt.pracownik_funkcja pf USING(id_funckja)
		WHERE pr.nr_lotu = lot
		ORDER BY pv.id_pracownik;
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC17 (log VARCHAR, pass VARCHAR)
RETURNS INT AS
$$
DECLARE
	id INT default -1;
BEGIN
	SELECT u.id_uzytkownik INTO id FROM projekt.uzytkownik u
	WHERE u.login = log AND u.passwd = pass;
	IF id IS NULL THEN RETURN -1;
	ELSE RETURN id;
	END IF;
END;
$$ LANGUAGE 'plpgsql';

---------------------
---------------------
CREATE OR REPLACE FUNCTION UC18 (log VARCHAR, pass VARCHAR)
RETURNS INT AS
$$
DECLARE
	id INT default -1;
BEGIN
	SELECT u.id_pracownik INTO id FROM projekt.pracownik u
	WHERE u.login = log AND u.passwd = pass;
	IF id IS NULL THEN RETURN -1;
	ELSE RETURN id;
	END IF;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION UC19 (rejs VARCHAR)
RETURNS TABLE(start VARCHAR, cel VARCHAR, utc_diff INT, data DATE, godzina TIME, czas_lotu TIME) AS
$$
DECLARE
	utc_start INT;
	utc_end INT;
	rec RECORD;
BEGIN
	FOR rec IN (SELECT t.id_lotnisko_start, t.id_lotnisko_cel, r.data, r.godzina, t.czas_lotu FROM projekt.rejs roz
		JOIN projekt.rozklad r USING (id_rozklad, id_trasa)
		JOIN projekt.trasa t USING (id_trasa)
		WHERE roz.nr_lotu = rejs
		ORDER BY r.data, r.godzina)
	LOOP
		SELECT lv.utc INTO utc_start FROM projekt.lotnisko_view lv WHERE lv.id_lotnisko = rec.id_lotnisko_start;
		SELECT lv.utc INTO utc_end FROM projekt.lotnisko_view lv WHERE lv.id_lotnisko = rec.id_lotnisko_cel;
		start := rec.id_lotnisko_start;
		cel := rec.id_lotnisko_cel;
		utc_diff := utc_end - utc_start;
		data := rec.data;
		godzina := rec.godzina;
		czas_lotu := rec.czas_lotu;
		RETURN NEXT;
	END LOOP;
END;
$$ LANGUAGE 'plpgsql';

--triggery
--
--
--

---------------------
---------------------
--triger - INSERT UZYTKOWNIK
CREATE OR REPLACE FUNCTION T1() RETURNS TRIGGER AS
$$
BEGIN
	IF NEW.imie IS NOT NULL THEN
		NEW.imie := lower(NEW.imie);
		NEW.imie := initcap(NEW.imie);
	END IF;
	IF NEW.nazwisko IS NOT NULL THEN
		NEW.nazwisko := lower(NEW.nazwisko);
		NEW.nazwisko := initcap(NEW.nazwisko);
	END IF;
	IF NEW.narodowosc IS NOT NULL THEN
		NEW.narodowosc := upper(NEW.narodowosc);
	ELSE
		RETURN NULL;
	END IF;

	IF NEW.nr_dokumentu IS NOT NULL THEN
		NEW.nr_dokumentu := upper(NEW.nr_dokumentu);
	ELSE
		RETURN NULL;
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER uzytkownik_trigger
	BEFORE INSERT ON uzytkownik
	FOR EACH ROW
	EXECUTE PROCEDURE t1();

--triger - UPDATE MIEJSCE
CREATE OR REPLACE FUNCTION T2() RETURNS TRIGGER AS
$$
BEGIN
	IF NEW.czy_zajete = 'true' AND OLD.czy_zajete = 'false' THEN
		IF EXISTS( SELECT 1 FROM projekt.uzytkownik_view WHERE id_uzytkownik = NEW.id_uzytkownik) THEN
			IF NEW.imie IS NOT NULL THEN
				NEW.imie := lower(NEW.imie);
				NEW.imie := initcap(NEW.imie);
			ELSE RETURN NULL;
			END IF;

			IF NEW.nazwisko IS NOT NULL THEN
				NEW.nazwisko := lower(NEW.nazwisko);
				NEW.nazwisko := initcap(NEW.nazwisko);
			ELSE RETURN NULL;
			END IF;

			IF NEW.narodowosc IS NOT NULL THEN
				NEW.narodowosc := upper(NEW.narodowosc);
			ELSE RETURN NULL;
			END IF;

		ELSE RETURN NULL;
		END IF;

	ELSIF NEW.czy_zajete = 'false' AND OLD.czy_zajete = 'true' THEN
		IF NEW.id_uzytkownik <> OLD.id_uzytkownik THEN RETURN NULL;
		END IF;
		DELETE FROM projekt.bagaz b WHERE b.id_miejsce = OLD.id_miejsce AND b.nr_lotu = OLD.nr_lotu;
		NEW.id_uzytkownik := NULL;
		NEW.imie := NULL;
		NEW.nazwisko := NULL;
		NEW.data_urodzenia := NULL;
		NEW.narodowosc := NULL;

	ELSE RETURN NULL;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER miejsce_trigger
	BEFORE UPDATE ON miejsce
	FOR EACH ROW
	EXECUTE PROCEDURE t2();

--triger - INSERT BAGAZ
CREATE OR REPLACE FUNCTION T3() RETURNS TRIGGER AS
$$
BEGIN
	IF EXISTS( SELECT 1 FROM projekt.bagaz_typ bt WHERE bt.id = NEW.id_typ) THEN RETURN NEW;
	ELSE RETURN NULL;
	END IF;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER bagaz_update_trigger
	BEFORE INSERT ON bagaz
	FOR EACH ROW
	EXECUTE PROCEDURE t3();