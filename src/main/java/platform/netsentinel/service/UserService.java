package platform.netsentinel.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import platform.netsentinel.dto.auth.UserDto;
import platform.netsentinel.model.Company;
import platform.netsentinel.model.Role;
import platform.netsentinel.model.User;
import platform.netsentinel.repository.CompanyRepository;
import platform.netsentinel.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByCompanyId(Long companyId) {
        return userRepository.findByCompanyId(companyId);
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public boolean isEmailTaken(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Transactional
    public User registerUser(UserDto userDto) {
        Company company = companyRepository.findByName(userDto.getCompanyName())
                .orElseGet(() -> {
                    Company newCompany = new Company();
                    newCompany.setName(userDto.getCompanyName());
                    newCompany.setDepartment(userDto.getDepartment());
                    newCompany.setWebsite(userDto.getCompanyWebsite());
                    newCompany.setCountry(userDto.getCountry());
                    newCompany.setCity(userDto.getCity());
                    newCompany.setStreet(userDto.getStreet());
                    newCompany.setPostalCode(userDto.getPostalCode());
                    newCompany.setOffice(userDto.getOffice());
                    return companyRepository.save(newCompany);
                });

        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setFirstName(userDto.getName());
        user.setLastName(userDto.getLastName());
        user.setPhone(userDto.getPhone());
        user.setRole(Role.USER);
        user.setCompany(company);

        return userRepository.save(user);
    }

    public Optional<User> authenticateUser(String email, String rawPassword, HttpServletRequest request) {
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPassword()));
    }

    public void updateEmploymentStatus(Long id, String status) {
        User user = findById(id);
        if (user != null) {
            user.setEmploymentStatus(status);
            userRepository.save(user);
        }
    }
}
