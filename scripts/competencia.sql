CREATE TABLE `competencias`.`competencia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(70) NOT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `competencias`.`competencia` 
ADD COLUMN `genero_id` INT UNSIGNED NULL AFTER `nombre`,
ADD INDEX `genero_id_idx` (`genero_id` ASC) VISIBLE;
;
ALTER TABLE `competencias`.`competencia` 
ADD CONSTRAINT `genero_id_competencia`
  FOREIGN KEY (`genero_id`)
  REFERENCES `competencias`.`genero` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `competencias`.`competencia` 
ADD CONSTRAINT `director_id_competencia`
  FOREIGN KEY (`director_id`)
  REFERENCES `competencias`.`director` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `competencias`.`competencia` 
ADD CONSTRAINT `actor_id_competencia`
  FOREIGN KEY (`actor_id`)
  REFERENCES `competencias`.`actor` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE TABLE `competencias`.`voto` (
  `idvoto` INT NOT NULL AUTO_INCREMENT,
  `pelicula_id` INT NOT NULL,
  `competencia_id` INT NOT NULL,
  PRIMARY KEY (`idvoto`));

