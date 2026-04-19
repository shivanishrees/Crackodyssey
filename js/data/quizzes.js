// ============================================
// QUIZ DATA – Questions for each level
// ============================================

export const QUIZZES = {
    1: {
        title: 'Level 1 – OOP Foundations Quiz',
        questions: [
            {
                question: 'Q1 — Which of the following best describes a CLASS in OOP?',
                options: [
                    'A) A specific car parked in a lot',
                    'B) A blueprint used to create objects',
                    'C) A method that runs automatically',
                    'D) A variable that stores data',
                ],
                correct: 1,
                explanation: 'A class is a template. Just like a blueprint defines a house\'s structure but isn\'t a house itself, a class defines the structure of objects. Objects are the actual instances created from that class.',
            },
            {
                question: 'Q2 — A smartphone has properties like brand, color, and battery level, and behaviors like call() and playMusic(). In OOP terms, what is the smartphone?',
                options: [
                    'A) A class',
                    'B) An attribute',
                    'C) An object',
                    'D) A method',
                ],
                correct: 2,
                explanation: 'The smartphone with specific values (e.g., brand = "Samsung") is an instance — an object — created from the Smartphone class. The class is the blueprint; the actual smartphone with real data is the object.',
            },
            {
                question: 'Q3 — You\'re driving a car. You press the accelerator to speed up, but have no idea how the engine combustion works internally. Which OOP concept does this represent?',
                options: [
                    'A) Encapsulation',
                    'B) Inheritance',
                    'C) Polymorphism',
                    'D) Abstraction',
                ],
                correct: 3,
                explanation: 'Abstraction hides complex internal workings and exposes only what the user needs. You interact with the pedal (interface), not the engine internals (implementation). Encapsulation is about data hiding within a class — a related but distinct concept.',
            },
            {
                question: 'Q4 — A developer creates a BankAccount class. The balance attribute is marked private, and access is only allowed through deposit() and withdraw() methods. Which OOP principle is being applied?',
                options: [
                    'A) Abstraction',
                    'B) Polymorphism',
                    'C) Encapsulation',
                    'D) Inheritance',
                ],
                correct: 2,
                explanation: 'Encapsulation means protecting data by making it private and only allowing controlled access through public methods — exactly what\'s happening with the balance here. The data is bundled with the methods that operate on it.',
            },
            {
                question: 'Q5 — A Dog class and a Cat class both have a method called speak(). Dog\'s speak() returns "Woof" and Cat\'s speak() returns "Meow". What concept is being demonstrated?',
                options: [
                    'A) Encapsulation',
                    'B) Constructor',
                    'C) Method Overloading',
                    'D) Method Overriding / Polymorphism',
                ],
                correct: 3,
                explanation: 'Both classes override speak() differently. This is runtime polymorphism — the same method name behaves differently depending on the object. Method Overloading would be the same class having multiple methods with the same name but different parameters.',
            },
            {
                question: 'Q6 — A class Vehicle has attributes speed and fuel, and a method move(). A class Car extends Vehicle and adds a new method honk(). Which statement is TRUE?',
                options: [
                    'A) Car cannot use the move() method',
                    'B) Vehicle is the child class',
                    'C) Car inherits speed, fuel, and move() from Vehicle',
                    'D) Car and Vehicle are unrelated',
                ],
                correct: 2,
                explanation: 'Through inheritance, the child class Car automatically gets all non-private attributes and methods of the parent class Vehicle, plus its own additions like honk(). Vehicle is the parent (superclass) and Car is the child (subclass).',
            },
            {
                question: 'Q7 — "A SavingsAccount and FixedDepositAccount both extend BankAccount and each calculate interest differently." Which TWO pillars are demonstrated here?',
                options: [
                    'A) Abstraction and Encapsulation',
                    'B) Inheritance and Polymorphism',
                    'C) Encapsulation and Polymorphism',
                    'D) Abstraction and Inheritance',
                ],
                correct: 1,
                explanation: 'Extending BankAccount = Inheritance (parent-child relationship). calculateInterest() behaving differently in each subclass = Polymorphism (same method, different behavior). These two pillars work together to create flexible, reusable class hierarchies.',
            },
            {
                question: 'Q8 — When new Employee("John", 101) is called, a special method runs automatically and sets name="John" and id=101. What is this method called?',
                options: [
                    'A) Initializer',
                    'B) Destructor',
                    'C) Constructor',
                    'D) Static Loader',
                ],
                correct: 2,
                explanation: 'A constructor is a special method with the same name as the class, automatically called when an object is created. It initializes the object\'s attributes. Java provides a default no-argument constructor if none is explicitly defined.',
            },
            {
                question: 'Q9 — Inside a constructor, this.name = name; is used where the parameter shares the name of the field. What does "this" refer to?',
                options: [
                    'A) The parent class',
                    'B) The static class reference',
                    'C) The current object instance',
                    'D) The constructor itself',
                ],
                correct: 2,
                explanation: '"this" is a reference to the current object. When a parameter has the same name as an instance variable, this.name refers to the object\'s field while name alone refers to the parameter. Without this, the field would not be updated.',
            },
            {
                question: 'Q10 — Which of the following correctly lists ALL FOUR pillars of OOP?',
                options: [
                    'A) Inheritance, Polymorphism, Looping, and Recursion',
                    'B) Classes, Objects, Methods, and Variables',
                    'C) Encapsulation, Abstraction, Inheritance, and Polymorphism',
                    'D) Static, Final, Abstract, and Interface',
                ],
                correct: 2,
                explanation: 'The four fundamental pillars of OOP are: Encapsulation (data protection with access control), Abstraction (hiding complexity), Inheritance (code reuse through parent-child relationships), and Polymorphism (one interface, many behaviors). These are the building blocks of all OOP design.',
            },
        ],
    },

    2: {
        title: 'Level 2 – Advanced OOP Quiz',
        questions: [
            {
                question: 'Q1 — Which of the following is resolved at COMPILE TIME?',
                options: [
                    'A) Method overriding via parent reference',
                    'B) Dynamic dispatch through inheritance',
                    'C) Method overloading based on parameter types',
                    'D) Virtual method calls in subclasses',
                ],
                correct: 2,
                explanation: 'Method overloading is compile-time (static) polymorphism — the compiler selects the correct version based on the method signature before execution. Method overriding is resolved at runtime by the JVM through dynamic dispatch.',
            },
            {
                question: 'Q2 — Given: Animal a = new Dog(); — Animal has a speak() method and Dog overrides it. What happens when a.speak() is called?',
                options: [
                    'A) Animal\'s speak() is called because the reference is of type Animal',
                    'B) Compilation error — type mismatch',
                    'C) Dog\'s speak() is called because the actual object is Dog',
                    'D) Both Animal\'s and Dog\'s speak() are called',
                ],
                correct: 2,
                explanation: 'This is runtime polymorphism in action. The JVM looks at the actual object (Dog), not the reference type (Animal), to decide which speak() to call — this is dynamic dispatch. The reference type only matters for compile-time method accessibility.',
            },
            {
                question: 'Q3 — Which statement is TRUE about Interfaces in Java?',
                options: [
                    'A) An interface can have a constructor',
                    'B) A class can extend multiple interfaces',
                    'C) Interface variables can be reassigned anywhere in the program',
                    'D) A class can implement multiple interfaces simultaneously',
                ],
                correct: 3,
                explanation: 'Java allows a class to implement multiple interfaces, solving the multiple inheritance problem. Interface variables are implicitly public static final (constants) and cannot be reassigned. Interfaces have no constructors and are implemented (not extended) by classes.',
            },
            {
                question: 'Q4 — A developer writes: Vehicle v = new ElectricCar(); v.fuelType(); — ElectricCar overrides fuelType() from Vehicle. Which method runs and WHY?',
                options: [
                    'A) Vehicle\'s fuelType() — because v is declared as Vehicle',
                    'B) ElectricCar\'s fuelType() — because the actual object is ElectricCar (dynamic dispatch)',
                    'C) Both methods run in sequence',
                    'D) A compilation error occurs',
                ],
                correct: 1,
                explanation: 'This is the classic runtime polymorphism scenario. The reference type (Vehicle) is irrelevant for overridden methods — the JVM dispatches the call to the actual object\'s class (ElectricCar) at runtime. This is dynamic method dispatch.',
            },
            {
                question: 'Q5 — What is the correct use of the super keyword?',
                options: [
                    'A) To refer to the current object\'s instance variables',
                    'B) To call the parent class constructor or access parent class methods',
                    'C) To prevent a method from being overridden',
                    'D) To declare a class-level shared variable',
                ],
                correct: 1,
                explanation: 'super refers to the parent class. It\'s used to call the parent\'s constructor (super()), access parent methods (super.method()), or access parent fields. The keyword this refers to the current object. The final keyword prevents overriding.',
            },
            {
                question: 'Q6 — A Printer class handles printing, scanning, and emailing. A developer adds a fax feature by modifying this same class. Which TWO SOLID principles are violated?',
                options: [
                    'A) Liskov Substitution & Dependency Inversion',
                    'B) Single Responsibility Principle & Open/Closed Principle',
                    'C) Interface Segregation & Liskov Substitution',
                    'D) Open/Closed Principle & Dependency Inversion',
                ],
                correct: 1,
                explanation: 'SRP is violated because the class has multiple responsibilities (print, scan, email). OCP is violated because adding a new feature (fax) requires modifying the existing class instead of extending it. Fix: separate classes per responsibility, extend rather than modify.',
            },
            {
                question: 'Q7 — You are designing a system where Dog walks, Bird flies, and Fish swims. Which design approach best follows OOP principles?',
                options: [
                    'A) Create one Animal class with an if/else chain to check the type and call different moves',
                    'B) Define a Movable interface and let each class implement move() in its own way',
                    'C) Copy and paste the move logic into each class separately',
                    'D) Make all three extend a single abstract class that forces all to use the same move() implementation',
                ],
                correct: 1,
                explanation: 'Defining a Movable interface follows Polymorphism (same interface, different behavior per class) and ISP (each class only implements what it needs). An if/else chain violates OCP. Copy-pasting violates DRY. Forcing a fixed move() in an abstract class violates LSP.',
            },
            {
                question: 'Q8 — A class SchoolRecord has 500 student objects. The method getSchoolName() always returns "Springfield High" for every object. Which keyword should be used to optimize this?',
                options: [
                    'A) final',
                    'B) abstract',
                    'C) static',
                    'D) protected',
                ],
                correct: 2,
                explanation: 'static makes the method belong to the class itself, not individual objects. Since the school name is shared by all students, it doesn\'t need an instance to access — call it as SchoolRecord.getSchoolName(). This avoids creating 500 separate references to the same data.',
            },
            {
                question: 'Q9 — Inside Lion.sound(), a developer wants to call Animal\'s sound() method FIRST, then add "Roar!". Which syntax is correct?',
                options: [
                    'A) parent.sound();',
                    'B) Animal.sound();',
                    'C) super.sound();',
                    'D) this.sound();',
                ],
                correct: 2,
                explanation: 'super.sound() calls the parent class\'s version of the method, letting the child extend (not replace) the parent behavior. this.sound() would cause infinite recursion. Animal.sound() is not valid Java syntax for instance method calls.',
            },
            {
                question: 'Q10 — ModuleA creates instances of ModuleB and ModuleC directly. Every time B or C changes, A breaks. Which concept describes this and which SOLID principle fixes it?',
                options: [
                    'A) Low Cohesion — fix with Single Responsibility Principle',
                    'B) High Coupling — fix with Dependency Inversion Principle',
                    'C) Method Overriding — fix with Liskov Substitution Principle',
                    'D) Multiple Inheritance — fix with Interface Segregation Principle',
                ],
                correct: 1,
                explanation: 'High Coupling means classes are tightly dependent on each other\'s concrete implementations. The Dependency Inversion Principle says: "Depend on abstractions, not concretions." A should depend on interfaces that B and C implement — changes to B/C won\'t break A.',
            },
        ],
    },

    3: {
        title: 'Level 3 – Encapsulation Lock System Quiz',
        questions: [
            {
                question: 'Q1 — What is the PRIMARY purpose of encapsulation in OOP?',
                options: [
                    'A) To speed up code execution',
                    'B) To bundle data and methods while restricting direct external access',
                    'C) To allow multiple classes to inherit from each other',
                    'D) To create multiple objects from one class',
                ],
                correct: 1,
                explanation: 'Encapsulation bundles data (fields) and methods together inside a class and restricts direct external access using access modifiers like private. Controlled access is provided through public getters and setters — protecting the data from unintended misuse.',
            },
            {
                question: 'Q2 — In Java, which access modifier restricts a variable so ONLY the class itself can access it?',
                options: [
                    'A) public',
                    'B) protected',
                    'C) default',
                    'D) private',
                ],
                correct: 3,
                explanation: 'private restricts access exclusively to the class itself. public allows access everywhere, protected allows within class + package + subclasses, and default allows within the same package only. For encapsulation, fields should always be private.',
            },
            {
                question: 'Q3 — Given private int balance;, which is the CORRECT getter method?',
                options: [
                    'A) int getBalance() { return balance; }',
                    'B) private int getBalance() { return balance; }',
                    'C) public int getBalance() { return balance; }',
                    'D) public void getBalance() { balance; }',
                ],
                correct: 2,
                explanation: 'A getter must be public (so external classes can use it), return the correct type (int), follow the getFieldName() naming convention, and return the field value. Option A is missing public, Option B is private (useless externally), and Option D returns void instead of int.',
            },
            {
                question: 'Q4 — What does a setter method PRIMARILY do in encapsulation?',
                options: [
                    'A) Returns the value of a private field',
                    'B) Deletes a private field\'s value',
                    'C) Validates and assigns a new value to a private field',
                    'D) Converts a private field to public',
                ],
                correct: 2,
                explanation: 'A setter provides controlled write access. It typically validates the incoming value before assigning it to the private field — for example, preventing a negative balance. This is the core power of encapsulation: data cannot be corrupted through uncontrolled direct access.',
            },
            {
                question: 'Q5 — What is the security vulnerability in: class Account { public int balance; }?',
                options: [
                    'A) The class is missing a constructor',
                    'B) Any external code can set balance to an invalid value like -99999',
                    'C) The class cannot be instantiated',
                    'D) balance should be declared as static',
                ],
                correct: 1,
                explanation: 'With public access, any code can do account.balance = -99999 without any validation. This corrupts the object\'s state. Encapsulation (private field + setter with validation) prevents this by ensuring balance can only be changed through controlled, validated methods.',
            },
            {
                question: 'Q6 — After properly encapsulating Account, which code correctly modifies the balance?',
                options: [
                    'A) Account a = new Account(); a.balance = 500;',
                    'B) Account a = new Account(); a.setBalance(500);',
                    'C) Account a = new Account(); int b = a.balance;',
                    'D) Account a = new Account(); System.out.println(a.balance);',
                ],
                correct: 1,
                explanation: 'With encapsulation, balance is private and cannot be accessed directly from outside the class. The setter setBalance(500) is the only valid way to modify it. Options A, C, and D all attempt to directly access the private field, which causes a compile-time error.',
            },
            {
                question: 'Q7 — Which real-world scenario BEST demonstrates encapsulation?',
                options: [
                    'A) A child class inheriting traits from a parent class',
                    'B) An ATM machine — complex banking logic is hidden; you only interact through the public interface',
                    'C) One function working differently based on parameter types',
                    'D) Multiple classes sharing the same base blueprint',
                ],
                correct: 1,
                explanation: 'An ATM is a perfect encapsulation analogy: the internal banking logic (private data/methods) is hidden inside, and you only interact through the public interface (buttons/screen). You withdraw money without knowing how the internal ledger works — that\'s controlled access to hidden data.',
            },
            {
                question: 'Q8 — In public void setBalance(int balance), which keyword distinguishes the instance variable from the parameter?',
                options: [
                    'A) super',
                    'B) self',
                    'C) this',
                    'D) static',
                ],
                correct: 2,
                explanation: 'this.balance = balance — this.balance refers to the object\'s instance field, while balance alone refers to the method parameter. Without this, the assignment balance = balance has no effect on the field. This is one of the most common uses of the this keyword.',
            },
            {
                question: 'Q9 — Which statement about encapsulation is TRUE?',
                options: [
                    'A) Encapsulation makes all class fields directly accessible to other classes',
                    'B) An encapsulated class cannot have any public methods',
                    'C) Setters in encapsulated classes can include validation logic to protect data',
                    'D) Encapsulation eliminates the need for constructors',
                ],
                correct: 2,
                explanation: 'One of the key benefits of encapsulation is that setters can include validation — e.g., if (amount >= 0) this.balance = amount. This ensures data integrity. Getters and setters are public methods and are essential to encapsulation. Constructors are still fully needed.',
            },
            {
                question: 'Q10 — A BankAccount has private double balance and private double interestRate. Each setter rejects invalid values (negative balance, interest > 100%). This design demonstrates:',
                options: [
                    'A) Polymorphism — same method name behaving differently',
                    'B) Inheritance — BankAccount extending a parent class',
                    'C) Encapsulation — private data with validated, controlled public access',
                    'D) Abstraction — hiding the interest calculation algorithm',
                ],
                correct: 2,
                explanation: 'This is textbook encapsulation: private fields + public setters with validation = controlled, protected access. The setter rejects invalid values — this is exactly what encapsulation achieves: protecting the object\'s state from invalid or malicious modifications.',
            },
        ],
    },

    4: {
        title: 'Level 4 – Adaptive AI Boss Quiz',
        questions: [
            {
                question: 'Q1 — In the Boss Battle, you used Warrior, Mage, and Archer classes that all extend Character. What OOP concept does this demonstrate?',
                options: [
                    'A) Encapsulation — hiding internal data from external access',
                    'B) Polymorphism — same method behaving differently',
                    'C) Inheritance — subclasses acquiring behavior from a parent class',
                    'D) Abstraction — hiding implementation complexity',
                ],
                correct: 2,
                explanation: 'Warrior, Mage, and Archer all extend (inherit from) the base Character class. This is Inheritance — the child classes reuse Character\'s common behavior and add their own specializations. Using multiple subclasses is the "inheritance diversity" the boss rewarded!',
            },
            {
                question: 'Q2 — The boss penalized you for using the same attack() method repeatedly. What OOP concept were you failing to use?',
                options: [
                    'A) Encapsulation — your data was exposed',
                    'B) Polymorphism — using multiple attack strategies with the same interface',
                    'C) Inheritance — not creating subclasses',
                    'D) Static binding — calling methods at compile time',
                ],
                correct: 1,
                explanation: 'Polymorphism means having multiple behaviors behind one interface. Attack strategies (Slash, FireBolt, ArrowRain, etc.) all share the attack() interface but behave differently. Spamming one method violates polymorphism — you\'re hardcoding logic instead of using flexible, interchangeable strategies.',
            },
            {
                question: 'Q3 — The boss stole your HP when you chose "Direct: health" instead of "Use getHealth()". Which OOP principle were you violating?',
                options: [
                    'A) Inheritance — not using a parent class',
                    'B) Polymorphism — not switching attack strategies',
                    'C) Encapsulation — accessing private data directly instead of through a getter',
                    'D) Abstraction — not hiding complexity',
                ],
                correct: 2,
                explanation: 'Encapsulation requires that private data be accessed only through controlled public methods (getters/setters). Accessing "health" directly bypasses this protection — just as the boss exploited it! In real code, direct field access breaks data integrity and exposes your class to external manipulation.',
            },
            {
                question: 'Q4 — Generic attacks worked against ALL boss forms (Fire, Ice, Shadow). Hardcoded attacks only worked against one. This teaches:',
                options: [
                    'A) Encapsulation — protecting field data',
                    'B) Inheritance — creating subclass hierarchies',
                    'C) Abstraction — designing logic that works regardless of the concrete type underneath',
                    'D) Method Overloading — same method name, different parameters',
                ],
                correct: 2,
                explanation: 'Abstraction means your code works at a higher level, independent of the specific concrete implementation. A generic attack() that works on any boss form is abstracted — it doesn\'t care about the concrete form. This mirrors real code: well-abstracted methods work on any implementing class, not just one specific type.',
            },
            {
                question: 'Q5 — In OOP, which design pattern matches the boss\'s "AttackStrategy" system where attack behavior can be swapped at runtime?',
                options: [
                    'A) Singleton Pattern',
                    'B) Strategy Pattern — encapsulating interchangeable behaviors behind an interface',
                    'C) Factory Pattern — creating objects through a factory class',
                    'D) Observer Pattern — notifying dependents on state change',
                ],
                correct: 1,
                explanation: 'The Strategy Pattern defines a family of algorithms (attack strategies), encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently from clients that use it — exactly how AttackStrategy.attack() worked in the boss battle. This is polymorphism applied as an architectural pattern.',
            },
            {
                question: 'Q6 — What is the difference between an Abstract Class and an Interface in Java?',
                options: [
                    'A) Abstract classes can have concrete methods; interfaces cannot have any implemented methods',
                    'B) Abstract classes cannot be inherited; interfaces can be implemented by many classes',
                    'C) Abstract classes can have concrete methods and constructors; interfaces provide a pure contract (with default methods in Java 8+)',
                    'D) There is no difference — they are interchangeable',
                ],
                correct: 2,
                explanation: 'Abstract classes can have both abstract and concrete methods, constructors, and instance fields — they represent a partial implementation. Interfaces are contracts — they define what must be done, not how. Java 8+ interfaces can have default and static methods. Key rule: use abstract class for shared identity; use interface for shared capability.',
            },
            {
                question: 'Q7 — The Character base class has an abstract method attack(). Warrior and Mage must implement it differently. What Java keyword makes attack() mandatory to override?',
                options: [
                    'A) final',
                    'B) static',
                    'C) abstract',
                    'D) override',
                ],
                correct: 2,
                explanation: 'The abstract keyword on a method declares it without implementation, forcing every concrete subclass to provide its own version. A class with any abstract method must itself be declared abstract and cannot be instantiated directly. This enforces a contract while allowing different implementations.',
            },
            {
                question: 'Q8 — Animal a = new Dog(); a.attack(); — Dog overrides attack() from Animal. Which attack() runs?',
                options: [
                    'A) Animal\'s attack() — because the reference type is Animal',
                    'B) Dog\'s attack() — because the actual object at runtime is Dog (dynamic dispatch)',
                    'C) Both run in sequence',
                    'D) A compilation error occurs — type mismatch',
                ],
                correct: 1,
                explanation: 'This is runtime polymorphism via dynamic dispatch. Java looks at the actual object type (Dog), not the reference type (Animal), to determine which method to call. The reference type only affects compile-time visibility. This is what made the boss battle work — each character subclass provided its own attack behavior.',
            },
            {
                question: 'Q9 — The boss adapted its defense based on your attack patterns. In OOP design, which SOLID principle says your AttackStrategy should be extensible without modifying existing code?',
                options: [
                    'A) Single Responsibility Principle — one class, one job',
                    'B) Open/Closed Principle — open for extension, closed for modification',
                    'C) Liskov Substitution Principle — subclasses replace parents safely',
                    'D) Interface Segregation Principle — don\'t force unnecessary implementations',
                ],
                correct: 1,
                explanation: 'The Open/Closed Principle (OCP) states that a class should be open for extension but closed for modification. Adding a new AttackStrategy (e.g., LightningBolt) should require adding a new class, not changing existing ones. This is why the Strategy Pattern + Interface design is so powerful — new strategies plug in without touching existing code.',
            },
            {
                question: 'Q10 — Which of the following BEST summarizes how the four OOP pillars worked together in Level 4\'s boss battle?',
                options: [
                    'A) Encapsulation stored data; Abstraction hid the boss logic; Inheritance gave all characters the same attack; Polymorphism made all characters identical',
                    'B) Inheritance gave characters shared structure from Character; Polymorphism made attack() behave differently per strategy; Encapsulation protected health via getters; Abstraction made generic attacks work on all boss forms',
                    'C) Polymorphism = same class, different names; Inheritance = copy-pasting code; Encapsulation = making variables public; Abstraction = removing methods',
                    'D) All four pillars do the same thing — they are just different names for object creation',
                ],
                correct: 1,
                explanation: 'Level 4 was designed to make all four pillars tangible: Inheritance (Warrior/Mage/Archer extend Character), Polymorphism (attack() strategies behave differently), Encapsulation (health accessed via getHealth(), not directly), Abstraction (generic attacks work on any boss form). This is OOP in action — all four pillars working together in a real system.',
            },
        ],
    },

    5: {
        title: 'Level 5 – OOP Tower Defense Quiz',
        questions: [
            {
                question: 'Q1 — In Code Wars, the Encapsulation Tower defeated PublicField bugs. What real-world code problem does a "PublicField" bug represent?',
                options: [
                    'A) A class with too many methods',
                    'B) A public field that can be directly set to any value, bypassing validation',
                    'C) A field that is too large in data size',
                    'D) A method that returns a field value',
                ],
                correct: 1,
                explanation: 'A public field (e.g., public int balance) allows any code to set it directly — account.balance = -99999 — with no validation. Encapsulation fixes this: make the field private and expose it only through a validated setter. The Encapsulation Tower defeats this bug because private + getter/setter = protection.',
            },
            {
                question: 'Q2 — The Inheritance Tower defeated CopyPaste bugs by hitting multiple at once (splash). What principle does this teach?',
                options: [
                    'A) Copy the same code into every class that needs it',
                    'B) Use inheritance to define shared behavior once in a parent class, eliminating duplication',
                    'C) Use static methods to share logic',
                    'D) Write separate interfaces for each class',
                ],
                correct: 1,
                explanation: 'CopyPaste bugs represent duplicated code in multiple classes. Inheritance solves this — define common behavior in a parent class once, and all child classes inherit it. The Inheritance Tower\'s splash attack represents how one inheritance relationship eliminates many copies of the same code.',
            },
            {
                question: 'Q3 — The InstanceofChain enemy had a SHIELD that only the Polymorphism Tower could pierce. What anti-pattern does InstanceofChain represent?',
                options: [
                    'A) if (obj instanceof Dog) { ... } else if (obj instanceof Cat) { ... } — type-checking instead of using polymorphism',
                    'B) A chain of constructors calling each other',
                    'C) Multiple classes inheriting from the same parent',
                    'D) An interface implemented by many classes',
                ],
                correct: 0,
                explanation: 'InstanceofChain is the anti-pattern of using long if-else instanceof chains to handle different types. This is fragile, hard to extend, and violates OCP. Polymorphism fixes it: define a common interface/method and let each class provide its own implementation — no type-checking needed. The shield means regular fixes don\'t work; only proper polymorphism pierces it.',
            },
            {
                question: 'Q4 — The Abstraction Tower slowed ALL enemy types. In OOP, what does programming to abstraction achieve?',
                options: [
                    'A) Makes code run faster by removing unnecessary steps',
                    'B) Allows code to work with any implementing type — decoupling from specific concretions',
                    'C) Makes all fields private automatically',
                    'D) Forces all classes to have constructors',
                ],
                correct: 1,
                explanation: 'The Abstraction Tower affects all enemy types because abstraction isn\'t limited to one problem — it decouples your code from specific implementations. In OOP: depend on interfaces/abstract classes, not concrete classes. Your code then works with any type that implements the contract, without knowing the specific type underneath.',
            },
            {
                question: 'Q5 — The GodClass enemy was the hardest boss — tanky, shielded, and required the Interface Tower. What is a "God Class" in OOP?',
                options: [
                    'A) A class that extends all other classes',
                    'B) A class that does too many unrelated things — violating the Single Responsibility Principle',
                    'C) A class with the most methods in the project',
                    'D) An abstract class with no methods',
                ],
                correct: 1,
                explanation: 'A God Class is a massive class that handles too many responsibilities — UserManager that also does file I/O, email sending, and database operations. It violates SRP (Single Responsibility Principle) and makes the codebase fragile. The fix: break it apart into focused classes, connected via interfaces. That\'s why only the Interface Tower (representing proper contracts) defeats GodClass.',
            },
            {
                question: 'Q6 — Towers had "preferred" targets they dealt bonus damage to. This mirrors which OOP design principle?',
                options: [
                    'A) Liskov Substitution — any subclass works where a parent is expected',
                    'B) Interface Segregation — clients should not be forced to implement interfaces they don\'t use',
                    'C) Single Responsibility — each tower (class) is specialized for one specific purpose',
                    'D) Open/Closed Principle — towers cannot be modified after placement',
                ],
                correct: 2,
                explanation: 'Each tower type in Code Wars had a focused specialization — Encapsulation Tower defeats field exposure bugs, Inheritance Tower defeats duplication bugs. This is the Single Responsibility Principle: a class should have one primary reason to exist and one clear focus. Mixing all responsibilities into one "super tower" would be the God Class problem.',
            },
            {
                question: 'Q7 — Wave 3 introduced InstanceofChain enemies with shields. What is the correct OOP solution to replace instanceof chains?',
                options: [
                    'A) Add more if/else conditions to handle every possible type',
                    'B) Define a common interface with a polymorphic method — let each class implement it differently',
                    'C) Use a static method that accepts all types as parameters',
                    'D) Make all classes extend one mega parent class',
                ],
                correct: 1,
                explanation: 'The fix for instanceof chains is polymorphism via interfaces. Instead of: if (obj instanceof Dog) obj.bark(); else if (obj instanceof Cat) obj.meow(); — define interface Animal { void speak(); } and call obj.speak() on any Animal. Each class provides its own implementation, and you never need to check the type.',
            },
            {
                question: 'Q8 — The Abstraction Tower had the longest range (200px). In code, what gives abstraction its "long reach"?',
                options: [
                    'A) Abstract classes have more memory allocated at runtime',
                    'B) Programming to abstractions makes code work with future types that don\'t even exist yet',
                    'C) Abstraction makes all methods public by default',
                    'D) Abstract classes always run faster than concrete classes',
                ],
                correct: 1,
                explanation: 'Abstraction\'s "long range" represents its future-proofing power. When you program to an interface (List instead of ArrayList, Shape instead of Circle), your code automatically works with any future implementation without modification. You can introduce a new class (LinkedList, Triangle) and your existing code handles it — that\'s the "reach" of abstraction.',
            },
            {
                question: 'Q9 — Between waves you earned bonus coins to buy more towers. This models which software development practice?',
                options: [
                    'A) Waterfall development — plan everything upfront',
                    'B) Iterative improvement — refactor and strengthen your architecture between delivery cycles',
                    'C) Test-driven development — write tests before code',
                    'D) Continuous deployment — ship every small change immediately',
                ],
                correct: 1,
                explanation: 'Between waves (iterations), you evaluate your defense (code architecture), identify weaknesses exposed by the last wave, and invest resources to strengthen it. This mirrors iterative software development — after each sprint/release, refactor and improve your design based on what you learned. Good OOP design (well-placed towers) makes each wave easier.',
            },
            {
                question: 'Q10 — In Code Wars, placing the RIGHT tower type was more effective than placing many of the wrong ones. What does this teach about OOP design?',
                options: [
                    'A) More classes always means better code',
                    'B) The right abstraction in the right place beats quantity — design intent matters more than size',
                    'C) You should always use Abstraction for every problem',
                    'D) Encapsulation is the most important OOP principle and should be used everywhere',
                ],
                correct: 1,
                explanation: 'Placing 10 Encapsulation Towers won\'t stop a GodClass boss — you need the right tool. Similarly in OOP: more code, more classes, or more of any one pattern does not equal better design. Understanding WHICH principle solves WHICH problem — encapsulation for data protection, polymorphism for type flexibility, abstraction for decoupling — is what separates good design from mediocre code.',
            },
        ],
    },
};

