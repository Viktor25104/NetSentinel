package platform.netsentinel.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = true)
    private String website;

    @Column(nullable = true)
    private String department;

    private String country;
    private String city;
    private String street;
    private String postalCode;
    private String office;

    private LocalDateTime createdAt;


    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<User> users;

}
