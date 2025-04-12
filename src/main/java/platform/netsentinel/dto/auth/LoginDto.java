package platform.netsentinel.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDto {
    private String username;
    private String password;
}
