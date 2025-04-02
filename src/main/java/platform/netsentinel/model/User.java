package platform.netsentinel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String firstName;
    private String lastName;
    private String phone;

    @Column(length = 1000)
    private String bio;

    private String position;
    private String department;

    private String location;
    private String timezone;

    @Column(nullable = false)
    private boolean notifyPush = false;

    @Column(nullable = false)
    private boolean notifyEmail = false;

    @Column(nullable = false)
    private boolean notifyTelegram = false;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "avatar_url")
    private String avatar;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

}
