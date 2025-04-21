package platform.netsentinel.dto.auth;

public record NewUserDto(
        String email,
        String password,
        String firstName,
        String lastName,
        String position,
        String department
) {}

