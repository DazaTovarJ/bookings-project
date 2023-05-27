CREATE DATABASE bookings_service;

USE bookings_service;

CREATE TABLE users(
	id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	email VARCHAR(255) NOT NULL,
	given_name VARCHAR(255) NOT NULL,
	family_name VARCHAR(255) NOT NULL,
	user_password VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE rooms (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    room_number VARCHAR(255) NOT NULL,
    room_type VARCHAR(255) NOT NULL,
    room_value DECIMAL(10,2) NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    last_modified_by BIGINT UNSIGNED NOT NULL,
    deleted_by BIGINT UNSIGNED,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    INDEX created_by_fk_idx (created_by),
    CONSTRAINT created_by_fk
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX last_modified_by_fk_idx (last_modified_by),
    CONSTRAINT last_modified_by_fk
        FOREIGN KEY (last_modified_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX deleted_by_fk_idx (deleted_by),
    CONSTRAINT deleted_by_fk
        FOREIGN KEY (deleted_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE bookings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    room_id BIGINT UNSIGNED NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(15) NOT NULL,
    booking_date DATE NOT NULL,
    entry_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    last_modified_by BIGINT UNSIGNED NOT NULL,
    deleted_by BIGINT UNSIGNED,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    INDEX room_fk_idx (room_id),
    CONSTRAINT room_fk
        FOREIGN KEY (room_id) REFERENCES rooms(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX created_by_fk_idx1 (created_by),
    CONSTRAINT created_by_fk1
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX last_modified_by_fk_idx1 (last_modified_by),
    CONSTRAINT last_modified_by_fk1
        FOREIGN KEY (last_modified_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX deleted_by_fk_idx1 (deleted_by),
    CONSTRAINT deleted_by_fk1
        FOREIGN KEY (deleted_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
