using System.DirectoryServices.Protocols;
using System.Net;

namespace Backend.Routes;

public interface ILdapAuthService
{
    AuthResult Authenticate(string username, string password);
}

public class LDAPAuthService : ILdapAuthService
{
    private const string LdapServer = "127.0.0.1";
    private const int LdapPort = 389;
    private const string BaseDn = "dc=Jokeapp,dc=localhost";


    public AuthResult Authenticate(string username, string password)
    {
        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
        {
            return new AuthResult(false, "Username and Password are Required", null);
        }

        string userDn = $"uid={username},ou=people,{BaseDn}";


       try
            {
        LdapDirectoryIdentifier identifier = new LdapDirectoryIdentifier(LdapServer, LdapPort);
    
        using (LdapConnection connection = new LdapConnection(identifier))
        {
        connection.SessionOptions.ProtocolVersion = 3;
        connection.AuthType = AuthType.Basic;
        
        NetworkCredential credential = new NetworkCredential(userDn, password);
        connection.Bind(credential);

        string role = GetUserRole(connection, userDn);
        return new AuthResult(true, "Authentication successful", role);
        }
        } catch (LdapException ex) when (ex.ErrorCode == 49)
        {
            return new AuthResult(false, "Invalid LDAP username or password.", null);
        }
        catch (Exception ex)
        {
            return new AuthResult(false, $"LDAP Server Error: {ex.Message}", null);
        }

    }



    private string GetUserRole(LdapConnection connection, string userDn)
    {
        try
        {
            string adminFilter = $"(&(cn=admins)(member={userDn}))";
            SearchRequest searchRequest = new SearchRequest($"ou=groups,{BaseDn}", adminFilter, SearchScope.Subtree, null);
            SearchResponse searchResponse = (SearchResponse)connection.SendRequest(searchRequest);
            
            if (searchResponse.Entries.Count > 0) return "admin";
        }
        catch { }
        return "user";
    }
}





public record AuthResult(bool Success, string Message, string? Role);
public record LoginRequest(string Username, string Password);