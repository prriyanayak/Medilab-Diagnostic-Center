# lbeupuwzwmchfigw
import smtplib 
from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText 
from email.mime.base import MIMEBase 
from email import encoders 



def sendOTP(repEmail, adminAddress, repName, OTP):
    msg = MIMEMultipart() 
    

    msg['From'] = adminAddress
    msg['To'] = repEmail
    msg['Subject'] = "OTP for Uploading Report"

    
    body = "Dear "+ repName + ",\n\n"+str(OTP)+" is the OTP generated for uploading the Patient Report.\nDo not share your OTP with anyone else.\n\nWarm Regards,\nMedilab Team"
    

    msg.attach(MIMEText(body, 'plain')) 
    
    s = smtplib.SMTP('smtp.gmail.com', 587) 
    s.starttls()
    s.login(adminAddress, "lbeupuwzwmchfigw") 
    
    
    text = msg.as_string() 
    
    try:
        s.sendmail(adminAddress, repEmail, text) 
        s.quit() 
        return 1
    except:
        return 0
    

def sendReport(parameterDict):
    msg = MIMEMultipart() 
    

    msg['From'] = parameterDict['adminAddress'] 
    msg['To'] = parameterDict['patientEmail']
    msg['Subject'] = "Report for " + parameterDict['patientName']

    
    body = "Dear "+ parameterDict['patientName']+",\n\nPlease find attached the report for your test: "+parameterDict['test']+".\nFor more information on your report, please contact your doctor.\n\nWarm Regards,\n"+parameterDict['dc_name']+"\nPowered by Medilab"
    

    msg.attach(MIMEText(body, 'plain')) 
    

    attachment = open("C:/Users/Priya Nayak/Desktop/PESU/Sem 7/SE/Project/Reports/"+parameterDict['filename'], "rb") 
    
    
    p = MIMEBase('application', 'octet-stream') 
    
    
    p.set_payload((attachment).read()) 
    
    
    encoders.encode_base64(p) 
    
    p.add_header('Content-Disposition', "attachment; filename= %s" % parameterDict['filename']) 
    
    
    msg.attach(p) 
    
    
    s = smtplib.SMTP('smtp.gmail.com', 587) 
    
    
    s.starttls() 
    
    
    s.login(parameterDict['adminAddress'], "lbeupuwzwmchfigw") 
    
    
    text = msg.as_string() 
    
    try:
        s.sendmail(parameterDict["adminAddress"], parameterDict["patientEmail"], text) 
        s.quit() 
        return 1
    except:
        return 0
    