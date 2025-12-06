package com.example.issuetracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path root;

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir){
        this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
        try{ Files.createDirectories(root); } catch(IOException e){ throw new RuntimeException(e); }
    }

    public Path store(MultipartFile file, Long issueId) throws IOException {
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        String uuid = UUID.randomUUID().toString() + "-" + filename;
        Path dir = root.resolve(String.valueOf(issueId));
        Files.createDirectories(dir);
        Path target = dir.resolve(uuid);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return target;
    }

    public Path loadPath(String relativePath){
        return root.resolve(relativePath).toAbsolutePath().normalize();
    }
}
