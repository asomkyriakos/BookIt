package com.eventPlatform.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path directory;

    public FileStorageService(@Value("${app.upload.directory:uploads}") String uploadDirectory) {
        this.directory = Paths.get(uploadDirectory, "events")
                .toAbsolutePath()
                .normalize();
    }

    public String store(MultipartFile file) throws IOException {

        Files.createDirectories(directory);

        String original = file.getOriginalFilename();

        String extension = "";

        if (original != null && original.contains(".")) {
            extension = original.substring(original.lastIndexOf("."));
        }

        String filename = UUID.randomUUID() + extension;

        Path destination = directory
                .resolve(filename)
                .normalize();

        if (!destination.startsWith(directory)) {
            throw new IllegalArgumentException("Invalid filename");
        }

        file.transferTo(destination);

        return "/uploads/events/" + filename;
    }

    public void delete(String imageUrl) throws IOException {

        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        String filename = Paths.get(imageUrl)
                .getFileName()
                .toString();

        Path file = directory
                .resolve(filename)
                .normalize();

        if (!file.startsWith(directory)) {
            throw new IllegalArgumentException("Invalid filename");
        }

        Files.deleteIfExists(file);
    }
}
