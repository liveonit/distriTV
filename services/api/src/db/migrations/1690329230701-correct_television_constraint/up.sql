ALTER TABLE television
    ADD CONSTRAINT fk_television_alert
    FOREIGN KEY (alertId)
    REFERENCES alert (id)
        ON DELETE SET NULL
        ON UPDATE NO ACTION;