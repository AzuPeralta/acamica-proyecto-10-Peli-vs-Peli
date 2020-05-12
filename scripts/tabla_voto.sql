CREATE TABLE `competencias`.`voto` (
  `idvoto` INT NOT NULL AUTO_INCREMENT,
  `pelicula_id` INT NOT NULL,
  `competencia_id` INT NOT NULL,
  PRIMARY KEY (`idvoto`));

  ALTER TABLE `competencias`.`voto` 
ADD CONSTRAINT `competencia_id`
  FOREIGN KEY (`competencia_id`)
  REFERENCES `competencias`.`competencia` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `pelicula_id`
  FOREIGN KEY (`pelicula_id`)
  REFERENCES `competencias`.`pelicula` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
