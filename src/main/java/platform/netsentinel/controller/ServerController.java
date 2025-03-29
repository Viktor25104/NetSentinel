package platform.netsentinel.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import platform.netsentinel.model.Server;
import platform.netsentinel.service.ServerService;

import java.util.List;

@Controller
@RequestMapping("/server")
public class ServerController {

    private final ServerService serverService;

    public ServerController(ServerService serverService) {
        this.serverService = serverService;
    }

    @GetMapping("/all")
    @ResponseBody
    public List<Server> getAllServers() {
        return serverService.getServers();
    }

}
