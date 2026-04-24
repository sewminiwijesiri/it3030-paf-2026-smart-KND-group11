package com.smartcampus.booking.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.enums.BookingStatus;
import com.smartcampus.booking.exception.ResourceNotFoundException;
import com.smartcampus.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class QRCodeService {

    private final BookingRepository bookingRepository;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public String generateQRCodeBase64(String bookingId, String origin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("QR Code can only be generated for APPROVED bookings.");
        }

        String baseUrl = (origin != null && !origin.trim().isEmpty()) ? origin : frontendUrl;
        
        // If the URL contains localhost, try to replace it with the actual machine IP for mobile scanning
        if (baseUrl.contains("localhost")) {
            try {
                String ip = InetAddress.getLocalHost().getHostAddress();
                baseUrl = baseUrl.replace("localhost", ip);
            } catch (UnknownHostException e) {
                // Ignore and stick to localhost
            }
        }
        
        String verificationUrl = baseUrl + "/booking/verify/" + bookingId;

        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(verificationUrl, BarcodeFormat.QR_CODE, 250, 250);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            byte[] qrCodeBytes = outputStream.toByteArray();
            return Base64.getEncoder().encodeToString(qrCodeBytes);
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Error generating QR Code", e);
        }
    }
}
