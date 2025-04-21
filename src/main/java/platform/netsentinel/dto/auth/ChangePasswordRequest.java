package platform.netsentinel.dto.auth;

public record ChangePasswordRequest(
        String oldPassword,
        String newPassword
) {}

