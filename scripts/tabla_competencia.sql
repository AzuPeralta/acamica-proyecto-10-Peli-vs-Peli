CREATE TABLE `competencias`.`competencia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(70) NOT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `competencias`.`competencia` 
ADD COLUMN `genero_id` INT UNSIGNED NULL AFTER `nombre`,
ADD INDEX `genero_id_idx` (`genero_id` ASC) VISIBLE;
;
ALTER TABLE `competencias`.`competencia` 
DROP FOREIGN KEY `genero_id_competencia`;
ALTER TABLE `competencias`.`competencia` 
ADD INDEX `genero_id_competencia_idx` (`genero_id` ASC) VISIBLE,
DROP INDEX `genero_id_idx` ;
;

ALTER TABLE `competencias`.`competencia` 
ADD COLUMN `actor_id` INT UNSIGNED NULL AFTER `genero_id`,
ADD INDEX `actor_id_competencia_idx` (`actor_id` ASC) VISIBLE;
;
ALTER TABLE `competencias`.`competencia` 
ADD CONSTRAINT `actor_id_competencia`
  FOREIGN KEY (`actor_id`)
  REFERENCES `competencias`.`actor_pelicula` (`actor_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `competencias`.`competencia` 
ADD COLUMN `director_id` INT UNSIGNED NULL AFTER `actor_id`,
ADD INDEX `director_id_competencia_idx` (`director_id` ASC) VISIBLE;
;
ALTER TABLE `competencias`.`competencia` 
ADD CONSTRAINT `director_id_competencia`
  FOREIGN KEY (`director_id`)
  REFERENCES `competencias`.`director_pelicula` (`director_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
