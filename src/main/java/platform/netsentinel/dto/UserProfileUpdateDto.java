package platform.netsentinel.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileUpdateDto {
    private String firstName;
    private String lastName;
    private String phone;
    private String position;
    private String department;
    private String bio;
    private String location;
    private String timezone;

    private boolean notifyEmail;
    private boolean notifyPush;
    private boolean notifyTelegram;
}
