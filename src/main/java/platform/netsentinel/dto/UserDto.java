package platform.netsentinel.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    // Личные данные
    private String email;
    private String password;
    private String name;
    private String lastName;
    private String phone;

    // Компания
    private String companyName;
    private String companyWebsite;
    private String position;
    private String department;

    // Адрес
    private String country;
    private String city;
    private String street;
    private String postalCode;
    private String office;
}
