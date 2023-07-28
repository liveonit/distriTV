ALTER TABLE television
    DROP CONSTRAINT fk_television_alert;
    
ALTER TABLE television
    ADD CONSTRAINT fk_television_alert
    FOREIGN KEY (alertId)
    REFERENCES alert (id)
        ON DELETE SET NULL
        ON UPDATE NO ACTION;