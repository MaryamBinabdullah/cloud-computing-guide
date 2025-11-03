// Interactive Labs functionality
class CloudLabs {
    constructor() {
        this.terraformEditor = null;
        this.init();
    }

    init() {
        this.initializeTerraformLab();
        this.initializeCostCalculator();
        this.initializeServiceModelConfigurator();
        this.initializeIAMSimulator();
        this.initializeInteractiveDiagrams();
    }

    initializeTerraformLab() {
        const terraformTextarea = document.getElementById('terraform-code');
        if (!terraformTextarea) return;

        try {
            this.terraformEditor = CodeMirror.fromTextArea(terraformTextarea, {
                mode: 'ruby',
                theme: 'material-darker',
                lineNumbers: true,
                indentUnit: 2,
                lineWrapping: true,
                autocapitalize: false,
                autocorrect: false,
                spellcheck: false
            });

            // Set initial value - CUSTOMIZED FOR LIBYA COLLEGE
            const initialCode = `# Terraform configuration for College of Science and Technology
provider "aws" {
  region = "eu-south-1"  
}

# Create cloud storage for student projects
resource "aws_s3_bucket" "college_projects" {
  bucket = "ly-cst-student-projects-2025"
  
  tags = {
    Department   = "Information Technology"
    Project      = "Student Cloud Learning"
    Environment  = "education"
    College      = "College of Science and Technology"
  }
}

# Secure the bucket - student data protection
resource "aws_s3_bucket_public_access_block" "student_data_protection" {
  bucket = aws_s3_bucket.college_projects.id

  block_public_acls       = true    # Keep student work private
  block_public_policy     = true    # No public access
  ignore_public_acls      = true    # Extra security layer
  restrict_public_buckets = true    # Protect student projects
}

# Output for students to see their created resource
output "student_bucket_name" {
  value = aws_s3_bucket.college_projects.bucket
  description = "Cloud storage bucket for IT student projects"
}`;
            
            this.terraformEditor.setValue(initialCode);
        } catch (error) {
            console.error('Failed to initialize Terraform editor:', error);
        }
    }

    initializeCostCalculator() {
        const usersSlider = document.getElementById('users');
        const storageSlider = document.getElementById('storage');
        const usageSlider = document.getElementById('usage');
        
        if (!usersSlider || !storageSlider || !usageSlider) return;

        const updateCosts = () => {
            const users = parseInt(usersSlider.value);
            const storage = parseInt(storageSlider.value);
            const usage = parseInt(usageSlider.value);
            
            // Update display values
            document.getElementById('usersValue').textContent = users + ' users';
            document.getElementById('storageValue').textContent = storage + ' GB';
            document.getElementById('usageValue').textContent = usage + ' hours';
            
            // Calculate costs (simplified model)
            const capex = (users * 300) + (storage * 20) + 10000;
            const opex = (users * 5) + (storage * 0.02) + (usage * 0.10);
            const savings = capex - (opex * 12);
            
            // Update results
            document.getElementById('capexCost').textContent = '$' + capex.toLocaleString();
            document.getElementById('opexCost').textContent = '$' + opex.toLocaleString();
            document.getElementById('savings').textContent = '$' + savings.toLocaleString();
        };
        
        usersSlider.addEventListener('input', updateCosts);
        storageSlider.addEventListener('input', updateCosts);
        usageSlider.addEventListener('input', updateCosts);
        
        updateCosts(); // Initial calculation
    }

    initializeServiceModelConfigurator() {
        const inputs = ['controlLevel', 'teamSize', 'applicationType'];
        
        inputs.forEach(input => {
            const element = document.getElementById(input);
            if (element) {
                element.addEventListener('change', () => this.updateServiceModel());
            }
        });
        
        this.updateServiceModel(); // Initial update
    }

    updateServiceModel() {
        const control = document.getElementById('controlLevel')?.value;
        const team = document.getElementById('teamSize')?.value;
        const app = document.getElementById('applicationType')?.value;
        
        if (!control || !team || !app) return;

        let model = 'IaaS';
        let explanation = '';
        
        if (control === 'low' || app === 'standard') {
            model = 'SaaS';
            explanation = 'You need ready-to-use software with minimal configuration. SaaS provides the fastest time-to-value with minimal maintenance overhead.';
        } else if (control === 'medium' || team === 'small' || app === 'microservice') {
            model = 'PaaS';
            explanation = 'You want to focus on application code without managing infrastructure. PaaS provides the right balance of control and convenience, ideal for development teams.';
        } else {
            model = 'IaaS';
            explanation = 'You need full control over the operating system and runtime environment. IaaS gives you maximum flexibility and is perfect for custom requirements.';
        }
        
        const modelElement = document.getElementById('recommendedModel');
        const explanationElement = document.getElementById('modelExplanation');
        
        if (modelElement) modelElement.textContent = model;
        if (explanationElement) explanationElement.textContent = explanation;
    }

    initializeIAMSimulator() {
        const inputs = ['userRole', 'services'];
        
        inputs.forEach(input => {
            const element = document.getElementById(input);
            if (element) {
                element.addEventListener('change', () => this.generateIAMPolicy());
            }
        });
        
        this.generateIAMPolicy(); // Initial generation
    }

    generateIAMPolicy() {
        const role = document.getElementById('userRole')?.value;
        const services = Array.from(document.getElementById('services')?.selectedOptions || []).map(opt => opt.value);
        
        if (!role || !services) return;

        let actions = [];
        
        // Define actions based on role and services
        if (role === 'readonly') {
            services.forEach(service => {
                if (service === 's3') actions.push('s3:GetObject', 's3:ListBucket');
                if (service === 'ec2') actions.push('ec2:DescribeInstances', 'ec2:DescribeImages');
                if (service === 'rds') actions.push('rds:DescribeDBInstances');
                if (service === 'lambda') actions.push('lambda:GetFunction', 'lambda:ListFunctions');
                if (service === 'iam') actions.push('iam:ListUsers', 'iam:ListRoles');
            });
        } else if (role === 'developer') {
            services.forEach(service => {
                if (service === 's3') actions.push('s3:*');
                if (service === 'ec2') actions.push('ec2:RunInstances', 'ec2:StartInstances', 'ec2:StopInstances', 'ec2:DescribeInstances');
                if (service === 'rds') actions.push('rds:CreateDBInstance', 'rds:DeleteDBInstance', 'rds:DescribeDBInstances');
                if (service === 'lambda') actions.push('lambda:CreateFunction', 'lambda:InvokeFunction', 'lambda:ListFunctions');
                if (service === 'iam') actions.push('iam:GetUser', 'iam:ListRoles');
            });
        } else if (role === 'admin') {
            actions.push('*');
        }
        
        // Remove duplicates and sort
        actions = [...new Set(actions)].sort();
        
        const policy = {
            Version: "2025-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Action: actions,
                    Resource: "*"
                }
            ]
        };
        
        const policyElement = document.getElementById('iamPolicy');
        if (policyElement) {
            policyElement.textContent = JSON.stringify(policy, null, 2);
        }
        
        // Provide security feedback
        this.provideIAMFeedback(role, services, actions);
    }

    provideIAMFeedback(role, services, actions) {
        const feedback = document.getElementById('policyFeedback');
        if (!feedback) return;

        let warning = '';
        
        if (role === 'admin' && services.includes('iam')) {
            warning = '<strong>Security Warning:</strong> Giving IAM permissions to admin users can be dangerous. Follow the principle of least privilege.';
        } else if (actions.includes('*')) {
            warning = '<strong>Security Warning:</strong> Wildcard permissions (*) are not recommended. Grant only the specific permissions needed.';
        } else if (services.includes('s3') && actions.includes('s3:*')) {
            warning = '<strong>Security Tip:</strong> Consider using more specific S3 permissions instead of s3:* for better security.';
        }
        
        if (warning) {
            feedback.className = 'quiz-feedback feedback-incorrect';
            feedback.innerHTML = warning;
            feedback.style.display = 'block';
        } else {
            feedback.style.display = 'none';
        }
    }

    initializeInteractiveDiagrams() {
        // This is handled by the global function for now
        console.log('Interactive diagrams initialized');
    }

    // Terraform Lab Functions
    runTerraformCode() {
        const output = document.getElementById('terraform-output');
        if (!output) return;

        output.innerHTML = '<span class="output-info"># Initializing Terraform...</span>\n';
        output.innerHTML += '<span class="output-info"># Planning infrastructure changes...</span>\n\n';
        
        // Simulate Terraform execution
        setTimeout(() => {
            const currentCode = this.terraformEditor ? this.terraformEditor.getValue() : '';
            const bucketNameMatch = currentCode.match(/bucket\s*=\s*"([^"]+)"/);
            const bucketName = bucketNameMatch ? bucketNameMatch[1] : 'ly-cst-student-projects-2025';
            
            output.innerHTML += '<span class="output-success">✓ Plan: 2 to add, 0 to change, 0 to destroy.</span>\n\n';
            output.innerHTML += '<span class="output-info"># Resource actions are indicated with the following symbols:</span>\n';
            output.innerHTML += '<span class="output-success">  + create</span>\n\n';
            output.innerHTML += '<span class="output-info">Terraform will perform the following actions:</span>\n\n';
            output.innerHTML += '<span class="output-info">  # aws_s3_bucket.college_projects will be created</span>\n';
            output.innerHTML += '<span class="output-success">  + resource "aws_s3_bucket" "college_projects"</span>\n';
            output.innerHTML += `<span class="output-info">      + bucket = "${bucketName}"</span>\n`;
            output.innerHTML += '<span class="output-info">      + tags = {</span>\n';
            output.innerHTML += '<span class="output-info">          + "College"     = "College of Science and Technology"</span>\n';
            output.innerHTML += '<span class="output-info">          + "Department"  = "Information Technology"</span>\n';
            output.innerHTML += '<span class="output-info">          + "Environment" = "education"</span>\n';
            output.innerHTML += '<span class="output-info">          + "Project"     = "Student Cloud Learning"</span>\n';
            output.innerHTML += '<span class="output-info">        }</span>\n\n';
            output.innerHTML += '<span class="output-info">  # aws_s3_bucket_public_access_block.student_data_protection will be created</span>\n';
            output.innerHTML += '<span class="output-success">  + resource "aws_s3_bucket_public_access_block" "student_data_protection"</span>\n';
            output.innerHTML += '<span class="output-info">      + block_public_acls       = true</span>\n';
            output.innerHTML += '<span class="output-info">      + block_public_policy     = true</span>\n';
            output.innerHTML += '<span class="output-info">      + ignore_public_acls      = true</span>\n';
            output.innerHTML += '<span class="output-info">      + restrict_public_buckets = true</span>\n\n';
            output.innerHTML += '<span class="output-info">Plan: 2 to add, 0 to change, 0 to destroy.</span>\n\n';
            output.innerHTML += '<span class="output-success">✓ This configuration will create cloud resources for student learning!</span>\n';
            output.innerHTML += '<span class="output-info"># In a real environment, run: terraform apply</span>';
            
            // Scroll to output
            output.scrollTop = output.scrollHeight;
        }, 1000);
    }

    resetTerraformCode() {
        if (!this.terraformEditor) return;

        const originalCode = `# Terraform configuration for College of Science and Technology
provider "aws" {
  region = "eu-south-1"
}

# Create cloud storage for student projects
resource "aws_s3_bucket" "college_projects" {
  bucket = "libya-cst-student-projects-2024"
  
  tags = {
    Department   = "Information Technology"
    Project      = "Student Cloud Learning"
    Environment  = "education"
    College      = "College of Science and Technology"
  }
}

# Secure the bucket - student data protection
resource "aws_s3_bucket_public_access_block" "student_data_protection" {
  bucket = aws_s3_bucket.college_projects.id

  block_public_acls       = true    # Keep student work private
  block_public_policy     = true    # No public access
  ignore_public_acls      = true    # Extra security layer
  restrict_public_buckets = true    # Protect student projects
}

output "student_bucket_name" {
  value = aws_s3_bucket.college_projects.bucket
  description = "Cloud storage bucket for IT student projects"
}`;
        
        this.terraformEditor.setValue(originalCode);
        
        // Clear output
        const output = document.getElementById('terraform-output');
        if (output) {
            output.innerHTML = `# Welcome to the Terraform Lab!\n# \n# Edit the bucket name in the code above and click \n# "Run Configuration" to see what would be created.\n#\n# This simulates real Terraform execution without\n# needing AWS credentials.`;
        }
        
        if (window.cloudBlog) {
            window.cloudBlog.showNotification('Terraform code reset to original', 'success');
        }
    }
}

// Global functions for HTML onclick handlers
function runTerraformCode() {
    if (window.cloudLabs) {
        window.cloudLabs.runTerraformCode();
    }
}

function resetTerraformCode() {
    if (window.cloudLabs) {
        window.cloudLabs.resetTerraformCode();
    }
}

function showLayerDetails(layer) {
    const details = document.getElementById('layerDetails');
    if (!details) return;

    let content = '';
    
    switch(layer) {
        case 'saas':
            content = '<strong>SaaS (Software as a Service)</strong><br>' +
                     '<strong>You Manage:</strong> User access, data, configuration<br>' +
                     '<strong>Provider Manages:</strong> Applications, runtime, OS, virtualization, servers, storage, networking<br>' +
                     '<strong>Examples:</strong> Gmail, Salesforce, Office 365';
            break;
        case 'paas':
            content = '<strong>PaaS (Platform as a Service)</strong><br>' +
                     '<strong>You Manage:</strong> Applications, data<br>' +
                     '<strong>Provider Manages:</strong> Runtime, OS, virtualization, servers, storage, networking<br>' +
                     '<strong>Examples:</strong> Heroku, Google App Engine, AWS Elastic Beanstalk';
            break;
        case 'iaas':
            content = '<strong>IaaS (Infrastructure as a Service)</strong><br>' +
                     '<strong>You Manage:</strong> OS, runtime, applications, data<br>' +
                     '<strong>Provider Manages:</strong> Virtualization, servers, storage, networking<br>' +
                     '<strong>Examples:</strong> AWS EC2, Google Compute Engine, Azure VMs';
            break;
        case 'infrastructure':
            content = '<strong>Infrastructure (Provider Managed)</strong><br>' +
                     '<strong>Provider Manages:</strong> Physical servers, storage, networking, data centers<br>' +
                     '<strong>Your Responsibility:</strong> None of this layer<br>' +
                     '<strong>Examples:</strong> AWS data centers, Google network infrastructure';
            break;
        default:
            content = 'Click on any layer to see what you manage vs what the provider manages';
    }
    
    details.innerHTML = content;
    details.style.display = 'block';
}

// function toggleAnswer(card) {
//     card.classList.toggle('active');
// }

// Initialize labs when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cloudLabs = new CloudLabs();
});